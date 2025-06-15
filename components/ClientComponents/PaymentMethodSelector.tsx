"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPaymentMethod } from "@/store/slices/paymentSlice";
import { PaymentMethod } from "@/lib/types/payment_method_type";
import { RootState } from "@/store";

import PaymentMethodSelectorSkeleton from "../Skeletons/PaymentMethodSelectorSkeleton";
import EuroSymbolOutlinedIcon from '@mui/icons-material/EuroSymbolOutlined';
import { GetCouponData } from "@/lib/types/availabelCoupons";
import { useAvailableCoupons } from "@/hooks/useAvailableCoupons";
import { useRouter, useSearchParams } from "next/navigation";
import { applyCoupon, removeCoupon } from "@/store/slices/discountCoupon";

export const paymentMethods = [
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: <EuroSymbolOutlinedIcon className="text-orange-500" />,
  },
  {
    id: "google",
    name: "Google Pay",
    icon: (
      <Image
        src="https://static.takeaway.com/images/platform-payments/payment-options/GPay.png"
        alt="GPay"
        width={24}
        height={24}
      />
    ),
  },
  {
    id: "credit",
    name: "Credit or Debit card",
    icon: <CreditCardOutlinedIcon />,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: (
      <Image
        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
        alt="PayPal"
        width={24}
        height={24}
      />
    ),
  },
];

export default function PaymentMethodSelector({ availableCoupons, cartAmount }: { availableCoupons: GetCouponData[], cartAmount: number }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useAvailableCoupons({ availableCoupons, cartAmount });
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();
  const router = useRouter()
  const { appliedCoupon, errorMessage } = useSelector((state: RootState) => state.coupon)
  const searchParams = useSearchParams();
  const couponParam = searchParams.get('coupon') as string | null;
  const { payment_type } = useSelector((state: RootState) => state.payment);
  const [couponsDialogOpen, setCouponsDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const effectiveCoupon: string = useMemo(() => {
    setCouponCode(couponParam ?? '')
    return couponParam ?? '';
  }, [couponParam]);


  const addCouponToUrl = useCallback((coupon_code: string) => {
    if (effectiveCoupon !== appliedCoupon?.label) {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      url.searchParams.set('coupon', coupon_code);
      router.push(url.toString());
    }

  }, [router, effectiveCoupon, appliedCoupon]);


  useEffect(() => {
   
    if (couponCode && !appliedCoupon?.label) {
      setCouponCode(couponCode)
      dispatch(applyCoupon(effectiveCoupon))
      addCouponToUrl(couponCode)
      return;
    }
  }, [effectiveCoupon, couponCode, appliedCoupon, addCouponToUrl, dispatch])

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedPaymentMethod");
    const method = paymentMethods.find((m) => m.id === (payment_type ?? stored));
    if (method) {
      setSelectedMethod(method);
      dispatch(setPaymentMethod(method.id as PaymentMethod));
    } else {
      setSelectedMethod(paymentMethods[0]);
      dispatch(setPaymentMethod(paymentMethods[0].id as PaymentMethod));
    }
    setLoading(false);
  }, [payment_type, dispatch]);

  const handleSelect = () => {
    if (selectedMethod) {
      sessionStorage.setItem("selectedPaymentMethod", selectedMethod.id);
      dispatch(setPaymentMethod(selectedMethod.id as PaymentMethod));
      setTimeout(() => setOpen(false), 200);
    }
  };

  const openCouponDialog = () => setCouponDialogOpen(true);
  const closeCouponDialog = () => setCouponDialogOpen(false);
  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      // Empty coupon code means remove applied coupon
      applyCoupon('');  // or call a dedicated removeCoupon function if available
      dispatch(removeCoupon())
      closeCouponDialog();
      return;
    }

    dispatch(applyCoupon(couponCode))
    addCouponToUrl(couponCode)
    closeCouponDialog()
  };

  // Open/close Available Coupons dialog
  const openCouponsDialog = () => setCouponsDialogOpen(true);
  const closeCouponsDialog = () => setCouponsDialogOpen(false);

  // Copy coupon to clipboard and show snackbar
  const handleCopy = (couponLabel: string) => {
    navigator.clipboard.writeText(couponLabel).then(() => {
      setCopySuccess(true);
    });
  };

  return (
    <>
      {loading ? (
        <PaymentMethodSelectorSkeleton />
      ) : (
        <div className="max-w-md mx-auto p-6 my-4 bg-white rounded-xl shadow cursor-default select-none">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Payment options
          </Typography>

          <div
            className="flex items-center justify-between p-4 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center gap-2">
              <span>{selectedMethod?.icon}</span>
              <span className="text-lg font-medium">{selectedMethod?.name}</span>
            </div>
            <ArrowForwardIosOutlinedIcon className="text-gray-400" />
          </div>

          {selectedMethod?.id !== 'cash' && (
            <>
              <div
                className="flex items-center justify-between p-4 mt-4 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={openCouponDialog}
              >
                <Typography className="text-sm font-medium text-gray-800">
                  {appliedCoupon ? (
                    <span className="text-green-600">{appliedCoupon.label} applied successfully!</span>
                  ) : (
                    'Have a coupon? Tap to apply'
                  )}
                </Typography>
                {appliedCoupon ? <RemoveCircleOutlineOutlinedIcon className="text-orange-500" /> : <AddCircleOutlineOutlinedIcon className="text-orange-500" />}

              </div>

              {errorMessage && (
                <div className="mt-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2 animate-fade-in">
                  <svg
                    className="w-5 h-5 mt-0.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              {/* New clickable label to open coupons list dialog */}
              <div
                className="flex items-center justify-between p-4 mt-4 rounded-md bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                onClick={openCouponsDialog}
              >
                <Typography className="text-sm font-semibold text-blue-700">
                  Need a coupon? See available coupons
                </Typography>
              </div>
            </>
          )}
        </div>
      )}

      {/* Payment method selection dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen} fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 0,
          }}
        >
          <div className="flex items-center gap-2">
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 24 }} />
            Select Payment Method
          </div>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <List>
            {paymentMethods.map((method) => (
              <ListItem key={method.id} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedMethod(method)}
                  sx={{
                    py: 2, // increased vertical padding
                    px: 3,
                    fontSize: '1.1rem', // slightly larger text
                  }}
                  selected={selectedMethod?.id === method.id}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{method.icon}</ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: "1.1rem", fontWeight: 500 }}
                    primary={method.name}
                  />
                  {selectedMethod?.id === method.id && (
                    <CheckCircleIcon sx={{ color: "green" }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />

          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 3,
                backgroundColor: '#f36805',
                color: 'white',
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.2rem",
              }}
              onClick={handleSelect}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coupon apply dialog */}
      <Dialog open={couponDialogOpen} onClose={closeCouponDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Coupon</DialogTitle>
        <DialogContent>
          <TextField
            label="Coupon Code"
            fullWidth
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            autoFocus
            margin="dense"
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={closeCouponDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCouponApply}>
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Available Coupons Dialog */}
      <Dialog open={couponsDialogOpen} onClose={closeCouponsDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Available Coupons
          <IconButton
            aria-label="close"
            onClick={closeCouponsDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {availableCoupons.length === 0 && (
            <Typography>No coupons available at the moment.</Typography>
          )}
          {availableCoupons.map((coupon) => {
            const now = new Date();
            const startDate = new Date(coupon.startAt);
            const endDate = new Date(coupon.endBy);
            const isValid = now >= startDate && now <= endDate;

            if (!isValid) return null;

            return (
              <div
                key={coupon.label}
                className="p-3 mb-3 rounded-md border border-gray-300 bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {coupon.label}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {coupon.discount}% off — Valid until {endDate.toLocaleDateString()}
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleCopy(coupon.label)}
                >
                  Copy
                </Button>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>

      {/* Copy success snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }} onClose={() => setCopySuccess(false)}>
          Coupon copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
