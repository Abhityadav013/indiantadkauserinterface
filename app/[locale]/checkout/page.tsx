import NavBarNavigation from '@/components/NavBarNavigation'; // Try to make this a server component
import OrderDetails from '@/components/ClientComponents/OrderDetails';
import OrderSummary from '@/components/ClientComponents/OrderSummary';
import { getMenuData } from '@/lib/api/fetchMenuDataApi';
import { getCartData } from '@/lib/api/fetchCartDataApi';
import { MenuItem } from '@/lib/types/menu_type';
import { getUserData } from '@/lib/api/fetchUserDetailsApi';
import { Box } from '@mui/material';
import PaymentMethodSelector from '@/components/ClientComponents/PaymentMethodSelector';
import OrderConfirmationPage from '@/components/OrderConfirmationPage';
import { getAvailableCouponData } from '@/lib/api/fetchAvailabelCouponApi';

type CheckoutPageParam = {
  orderId?: string;
  basketId: string
};


export default async function CheckoutPage({ searchParams }: { searchParams?: Promise<CheckoutPageParam> }) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const orderId = resolvedParams?.orderId;
  const [menuData, cartdata, userData, availableCouponsData] = await Promise.all([getMenuData(), getCartData(), getUserData(), getAvailableCouponData()]);
  const menuItems: MenuItem[] = menuData.menuItems;
  const getCartTotal = () => {
    const cartTotal = cartdata.cartItems.reduce((total, cartItem) => {
      const foodItemMatch = menuItems.find((item) => item.id === cartItem.itemId);
      return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
    }, 0);
    return cartTotal

  };
  if (orderId) {
    return <OrderConfirmationPage orderId={orderId} />
  }
  else
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-2 bg-[url('https://testing.indiantadka.eu/assets/bg-checkout-multi.avif')] bg-no-repeat bg-cover bg-center">
        <NavBarNavigation label="Checkout" isImage={false} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column', // Stacked on extra-small screens (mobile)
                sm: 'column', // Optional: stacked on small screens
                md: 'row',    // Side-by-side on medium and up (tablet/laptop)
              },
              gap: 4,
              maxWidth: '1000px',
              width: '100%',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <OrderDetails userData={userData} />
              <PaymentMethodSelector availableCoupons={availableCouponsData} cartAmount={getCartTotal()}/>
            </Box>

            <Box sx={{ flex: 1 }}>
              <OrderSummary cart={cartdata} menu={menuItems} userData={userData} />
            </Box>
          </Box>
        </Box>
      </main>
    );
}