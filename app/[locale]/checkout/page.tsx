import NavBarNavigation from '@/components/NavBarNavigation'; // Try to make this a server component
import OrderDetails from '@/components/ClientComponents/OrderDetails';
import OrderSummary from '@/components/ClientComponents/OrderSummary';
import { getMenuData } from '@/lib/api/fetchMenuDataApi';
import { getCartData } from '@/lib/api/fetchCartDataApi';
import { MenuItem } from '@/lib/types/menu_type';
import { getUserData } from '@/lib/api/fetchUserDetailsApi';
import { Box } from '@mui/material';
import PaymentMethodSelector from '@/components/ClientComponents/PaymentMethodSelector';

export default async function CheckoutPage() {
  const [menuData, cartdata, userData] = await Promise.all([getMenuData(), getCartData(), getUserData()]);
  const menuItems: MenuItem[] = menuData.menuItems;
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
            <OrderDetails />
            <PaymentMethodSelector />
          </Box>

          <Box sx={{ flex: 1 }}>
            <OrderSummary cart={cartdata} menu={menuItems} userData={userData} />
          </Box>
        </Box>
      </Box>
    </main>
  );
}