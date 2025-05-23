import { Box } from '@mui/material';
import BasketToggle from './BasketToggle';
import { MenuItem } from '@/lib/types/menu_type';
import BaseketSideBarContent from './BaseketSideBarContent';
import { getCartData } from '@/lib/api/fetchCartDataApi';

interface BasketSidebarProps {
    menu: MenuItem[];
}

const BasketSidebar = async ({ menu }: BasketSidebarProps) => {
    const cartItems = await getCartData();
    console.log('BasketSidebar cartItems:::::',cartItems)
    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '480px', // Dynamic width depending on screen size
                backgroundColor: 'white',
                borderLeft: { xs: 'none', lg: '1px solid #e0e0e0' }, // Hide left border on smaller screens
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                padding: '1rem',
                display: 'block',
                overflowY: 'auto',
                mx: 'auto',
                zIndex: 1200, // Ensure it stays on top when scrolling
                // Mobile-specific styles
                '@media (max-width: 600px)': {
                    position: 'absolute',  // Make it absolute on mobile for better positioning
                    top: 0,
                    left: 0,
                    zIndex: 2000,
                    height: 'auto', // Let the height grow on mobile
                    width: '100%',  // Full width on mobile
                    boxShadow: 'none', // Optional: Remove box shadow on small screens
                    borderLeft: 'none', // Remove border for mobile view
                },
            }}
        >
            <h2 className="text-xl font-bold mb-4 text-center">Basket</h2>
            <div className="flex justify-center mb-2">
                <BasketToggle />
            </div>
            <BaseketSideBarContent cartItems={cartItems} menu={menu} />
        </Box>
    );
};

export default BasketSidebar;
