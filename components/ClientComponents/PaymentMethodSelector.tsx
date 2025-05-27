"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemIcon, ListItemButton } from "@mui/material";
import { CreditCard } from "@mui/icons-material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Image from "next/image";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
const paymentMethods = [
  { id: "apple", name: "Apple Pay", icon: <Image src="https://static.takeaway.com/images/platform-payments/payment-options/ApplePay.png" alt="ApplePay" width={24} height={24} /> },
  { id: "google", name: "Google Pay", icon: <Image src="https://static.takeaway.com/images/platform-payments/payment-options/GPay.png" alt="GPay" width={24} height={24} /> },
  { id: "credit", name: "Credit or Debit card", icon: <CreditCard /> },
  { id: "cash", name: "Cash on Delivery", icon: <AttachMoneyIcon /> },
  { id: "paypal", name: "PayPal", icon: <Image src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" width={24} height={24} /> },
];

export default function PaymentMethodSelector() {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);

  const handleSelect = (method: typeof paymentMethods[0]) => {
    setSelectedMethod(method);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-6 my-4 max-w-md mx-auto bg-white hover:bg-gray-100 rounded-xl cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">{selectedMethod.name}</span>
          </div>
        </div>
        <span ><ArrowForwardIosOutlinedIcon className="text-gray-400" /></span>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          <List>
            {paymentMethods.map((method) => (
              <ListItem key={method.id} disablePadding>
                <ListItemButton onClick={() => handleSelect(method)}>
                  <ListItemIcon>{method.icon}</ListItemIcon>
                  <ListItemText primary={method.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

    </>
  );
}
