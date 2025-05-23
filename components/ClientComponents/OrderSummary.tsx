// app/checkout/OrderSummary.tsx
import { Paper, Typography, Box } from "@mui/material";
import { LocalDining } from "@mui/icons-material";
import { MenuItem } from "@/lib/types/menu_type";
import CheckoutCart from "../CheckoutCart";
import { CustomerOrder } from "@/lib/types/customer_order_type";
import { Cart } from "@/lib/types/cart_type";
import GooglePayButton from "./paymentOptionsComponents/GooglePayButton";

interface OrderSummaryProps {
  cart: Cart[],
  menu: MenuItem[]
  userData: CustomerOrder
}


export default function OrderSummary({ cart, menu, userData }: OrderSummaryProps) {
  return (
    <Paper className="p-5 border mt-10 w-[100%] border-gray-200 rounded-lg shadow-sm">
      <Box className="flex items-center mb-4">
        <LocalDining className="mr-2 text-orange-500" />
        <Typography variant="h6" className="font-bold">
          Order summary
        </Typography>
      </Box>
      <CheckoutCart cart={cart} menu={menu} userData={userData} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
         <GooglePayButton />
      </Box>
    </Paper>
  );
}
