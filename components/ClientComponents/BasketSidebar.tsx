import { Box, Divider } from '@mui/material';
import CartHistory from './CartHistory';
import BillDetails from '../BillDetails';
import BasketToggle from './BasketToggle';
import { MenuItem } from '@/lib/types/menu_type';

interface BasketSidebarProps{
    menu: MenuItem[];
}

const BasketSidebar = async ({menu}:BasketSidebarProps) => {
    return (
        <Box
            sx={{
                position: 'sticky',
                top: '58px',
                height: '100vh',
                width: '460px',
                backgroundColor: 'white',
                borderLeft: '1px solid #e0e0e0',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                padding: '1rem',
                display: { xs: 'none', lg: 'block' },
                overflow: 'auto',
                mx: 'auto',
            }}

        >
            <h2 className="text-xl font-bold mb-4 text-center">Basket</h2>

            <div className="flex justify-center mb-2">
                <BasketToggle />
            </div>
            <CartHistory menu={menu} />
            <Divider sx={{ my: 1 }} />
            <BillDetails menu={menu} />
        </Box>
    );
};

export default BasketSidebar;
