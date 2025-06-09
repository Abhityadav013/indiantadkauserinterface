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
} from "@mui/material";

import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPaymentMethod } from "@/store/slices/paymentSlice";
import { PaymentMethod } from "@/lib/types/payment_method_type";
import { RootState } from "@/store";

import PaymentMethodSelectorSkeleton from "../Skeletons/PaymentMethodSelectorSkeleton";

export const paymentMethods = [
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
    id: "cash",
    name: "Cash on Delivery",
    icon: <AttachMoneyOutlinedIcon />,
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

export default function PaymentMethodSelector() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();
  const { payment_type } = useSelector((state: RootState) => state.payment);

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

  const handleSelect = (method: typeof paymentMethods[0]) => {
    setSelectedMethod(method);
    sessionStorage.setItem("selectedPaymentMethod", method.id);
    dispatch(setPaymentMethod(method.id as PaymentMethod));
    setTimeout(() => setOpen(false), 200);
  };

  const openCouponDialog = () => setCouponDialogOpen(true);
  const closeCouponDialog = () => setCouponDialogOpen(false);
  const handleCouponApply = () => {
    console.log("Applying coupon:", couponCode);
    // TODO: add coupon validation/dispatch here
    closeCouponDialog();
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

          <div
            className="flex items-center justify-between p-4 mt-4 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={openCouponDialog}
          >
            <Typography>Add Coupon</Typography>
             <AddCircleOutlineOutlinedIcon />
          </div>
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
                <ListItemButton onClick={() => handleSelect(method)}>
                  <ListItemIcon>{method.icon}</ListItemIcon>
                  <ListItemText primary={method.name} />
                  {selectedMethod?.id === method.id && (
                    <CheckCircleIcon sx={{ color: "green" }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Coupon dialog */}
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
            <Button variant="contained" onClick={handleCouponApply} disabled={!couponCode.trim()}>
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
