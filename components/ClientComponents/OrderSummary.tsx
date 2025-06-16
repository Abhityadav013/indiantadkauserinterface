import { Paper, Typography, Box } from "@mui/material";
import { LocalDining } from "@mui/icons-material";
import { MenuItem } from "@/lib/types/menu_type";
import CheckoutCart from "../CheckoutCart";
import { CustomerOrder } from "@/lib/types/customer_order_type";
import { Cart } from "@/lib/types/cart_type";
import PaymentMethod from "./paymentOptionsComponents/PaymentMethod";

interface OrderSummaryProps {
  cart: { cartItems: Cart[], basketId: string },
  menu: MenuItem[]
  userData: CustomerOrder
}


export default function OrderSummary({ cart, menu, userData }: OrderSummaryProps) {

  if (cart.cartItems.length == 0) {
    return null;
  }
  return (
    <Paper className="bg-white rounded-lg lg:mt-10 shadow p-4 max-w-md mx-auto">
      <Box className="flex items-center">
        <LocalDining className="mr-2 text-orange-500" />
        <Typography variant="h6" className="font-bold">
          Order summary
        </Typography>
      </Box>
      <CheckoutCart cart={cart.cartItems} menu={menu} userData={userData} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <PaymentMethod  userData={userData} />
      </Box>
    </Paper>
  );
}
