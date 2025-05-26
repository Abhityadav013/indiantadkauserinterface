
'use client'
import { Box } from '@mui/material';
import BasketToggle from './BasketToggle';
import { MenuItem } from '@/lib/types/menu_type';
import BaseketSideBarContent from './BaseketSideBarContent';
import { Cart } from '@/lib/types/cart_type';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import BasketDrawer from './mobileView/BasketDrawer';
import AddressForm from './AddressForm';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { useUpdateAddressDetails } from '@/hooks/useUpdateAddressDetails';

interface BasketSidebarProps {
    menu: MenuItem[];
    cartItems: Cart[]
}

const BasketSidebar = ({ menu, cartItems }: BasketSidebarProps) => {
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const { addressModel: isAddressModelOpen, customerDetails, customerOrder, } = useSelector((state: RootState) => state.address);
    const { loading, formError, setFormError, handleUpdateCustomerDetails, handleAdddressDetailClose, handleAdddressDetailOpen } = useUpdateAddressDetails();
    if (isMobile) {
        return (
            <>
                <BasketDrawer>
                    <h2 className="text-xl font-bold mb-4 text-center">Basket</h2>
                    <div className="flex justify-center mb-2">
                        <BasketToggle />
                    </div>

                    <BaseketSideBarContent
                        loading={loading}
                        customerDetails={customerDetails ?? {} as CustomerDetails}
                        cartItems={cartItems}
                        menu={menu}
                        handleAdddressDetailOpen={handleAdddressDetailOpen} />
                </BasketDrawer>
                <AddressForm
                    isAddressModelOpen={isAddressModelOpen}
                    customerDetails={customerDetails ?? {} as CustomerDetails}
                    customerOrder={customerOrder ?? {} as CustomerOrder}
                    formError={formError}
                    setFormError={setFormError}
                    handleAdddressDetailClose={handleAdddressDetailClose}
                    handleUpdateCustomerDetails={handleUpdateCustomerDetails}
                />
            </>

        )
    }

    return (
        <>
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%', // Dynamic width depending on screen size
                    backgroundColor: 'white',
                    borderLeft: { xs: 'none', lg: '1px solid #e0e0e0' }, // Hide left border on smaller screens
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    display: 'block',
                    overflowY: 'auto',
                    mx: 'auto',
                    zIndex: 1200, // Ensure it stays on top when scrolling
                }}
            >
                <h2 className="text-xl font-bold mb-4 text-center">Basket</h2>
                <div className="flex justify-center mb-2">
                    <BasketToggle />
                </div>
                <BaseketSideBarContent
                    loading={loading}
                    customerDetails={customerDetails ?? {} as CustomerDetails}
                    cartItems={cartItems}
                    menu={menu}
                    handleAdddressDetailOpen={handleAdddressDetailOpen} />
            </Box>
            <AddressForm
                isAddressModelOpen={isAddressModelOpen}
                customerDetails={customerDetails ?? {} as CustomerDetails}
                customerOrder={customerOrder ?? {} as CustomerOrder}
                formError={formError}
                setFormError={setFormError}
                handleAdddressDetailClose={handleAdddressDetailClose}
                handleUpdateCustomerDetails={handleUpdateCustomerDetails}
            />
        </>

    );
};

export default BasketSidebar;
