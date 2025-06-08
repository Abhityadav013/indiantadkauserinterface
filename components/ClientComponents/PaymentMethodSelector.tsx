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
} from "@mui/material";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useEffect, useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentMethodSelectorSkeleton from "../Skeletons/PaymentMethodSelectorSkeleton";

const paymentMethods = [
  {
    id: "apple",
    name: "Apple Pay",
    icon: (
      <Image
        src="https://static.takeaway.com/images/platform-payments/payment-options/ApplePay.png"
        alt="ApplePay"
        width={24}
        height={24}
      />
    ),
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

  // Load from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedPaymentMethod");
    const parsed = paymentMethods.find((m) => m.id === stored);
    if (parsed) {
      setSelectedMethod(parsed);
    } else {
      setSelectedMethod(paymentMethods[0]); // fallback
    }
    setLoading(false);
  }, []);

  const handleSelect = (method: typeof paymentMethods[0]) => {
    setSelectedMethod(method);
    sessionStorage.setItem("selectedPaymentMethod", method.id);
    setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  return (
    <>
      {loading ? (
       <PaymentMethodSelectorSkeleton />
      ) : (
        <div
          className="flex items-center justify-between p-6 my-4 max-w-md mx-auto bg-white hover:bg-gray-100 rounded-xl cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2">
            <span>{selectedMethod?.icon}</span>
            <span className="text-lg font-medium">{selectedMethod?.name}</span>
          </div>
          <ArrowForwardIosOutlinedIcon className="text-gray-400" />
        </div>
      )}

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
    </>
  );
}
