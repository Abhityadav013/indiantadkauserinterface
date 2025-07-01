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
import { OrderType } from '@/lib/types/order_type';
import SkeletonSidebar from '../Skeletons/SkeletonSidebar';
import { useHasMounted } from '@/hooks/useHasMounted';

interface BasketSidebarProps {
    menu: MenuItem[];
    cartItems: Cart[];
    orderType: OrderType;
}

const BasketSidebar = ({ menu, cartItems, orderType }: BasketSidebarProps) => {
    const hasMounted = useHasMounted();
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const { addressModel: isAddressModelOpen, customerDetails, customerOrder, } = useSelector((state: RootState) => state.address);
    const { loading, formError, setFormError, handleUpdateCustomerDetails, handleAdddressDetailClose, handleAdddressDetailOpen } = useUpdateAddressDetails();
    const isDataReady = customerDetails && customerOrder && !loading;
    
    if (!isDataReady) {
        return <SkeletonSidebar />; // or return null;
    }
    if (!hasMounted) {
        return <SkeletonSidebar />;
    }
    if (isMobile) {
        return (
            <>
                <BasketDrawer>
                    <h2 className="text-xl font-bold mb-4 text-center">Basket</h2>
                    <div className="flex justify-center mb-2">
                        <BasketToggle orderType={orderType} />
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
                    width: { xs: '100vw', sm: '90vw', lg: '34vw' },
                    backgroundColor: 'white',
                    borderLeft: { xs: 'none', lg: '1px solid #e0e0e0' },
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    display: 'block',
                    overflowY: 'auto',
                    mx: 'auto',
                    zIndex: 1200,
                }}
                aria-label="Basket Sidebar"
                role="complementary"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Basket</h2>
                <div className="flex justify-center mb-2">
                    <BasketToggle orderType={orderType} />
                </div>
                <BaseketSideBarContent
                    loading={loading}
                    customerDetails={customerDetails ?? {} as CustomerDetails}
                    cartItems={cartItems}
                    menu={menu}
                    handleAdddressDetailOpen={handleAdddressDetailOpen} />
                <div aria-live="polite">
                    {/* Place the basket total/summary here or wrap the BillDetails component */}
                </div>
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
