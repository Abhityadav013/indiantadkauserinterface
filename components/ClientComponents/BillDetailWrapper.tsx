'use client';
import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { OrderType } from '@/lib/types/order_type';
import Image from 'next/image';
import { MenuItem } from '@/lib/types/menu_type';
import { useCart } from '@/hooks/useCartDetails';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import AddressForm from './AddressForm';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';


interface BillDetailWrapperProps {
    menu: MenuItem[]
}
const BillDetailWrapper: React.FC<BillDetailWrapperProps> = ({ menu }) => {
    const [loading, setLoading] = useState(true);
    const [deliveryFee, setDeliveryFee] = useState(0);
    // const [isFreeDelivery, setFreeDelivery] = useState(false);
    const [cartAmountTotal, setCartAmountTotal] = useState<number>();
    const { menuItems, updateMenuItems, getCartTotal } = useCart();
    const order_type = useSelector((state: RootState) => state.order.orderType);
    const { customerDetails, customerOrder, formError, isAddressModelOpen, setFormError, handleAdddressDetailOpen, handleAdddressDetailClose, handleUpdateCustomerDetails } = useAddressDetails();

    useEffect(() => {
        if (!menuItems.length) {
            updateMenuItems(menu)
        }
    }, [menuItems, menu, updateMenuItems])

    useEffect(() => {
        const deliveryFee = sessionStorage.getItem('deliveryFee');
        //const freeDelivery = sessionStorage.getItem('freeDelivery');
        setDeliveryFee(deliveryFee ? Number(deliveryFee) : 0)
 
    }, [])

    // Update cart total in session storage, and set loading timeout
    useEffect(() => {
        const cartTotal = getCartTotal()
        if (cartTotal) {
            const total = ((cartTotal ?? 0) + deliveryFee ).toFixed(2);
            sessionStorage.setItem('cartTotalAmount', total);
            setCartAmountTotal(Number(total))
            setLoading(false);
        }
    }, [getCartTotal, deliveryFee]);

    const renderPriceOrLoader = (value: string | number) =>
        loading ? (
            <Image
                src="https://testing.indiantadka.eu/loadingCircle.gif"
                alt="Loading"
                width={20}
                height={20}
                className="rounded"
            />
        ) : (
            <span>€{value}</span>
        );

    const handleAddressModalOpen = () => handleAdddressDetailOpen(true);
    return (
        <>
            <Box className="mt-2 text-gray-700">
                <Typography variant="body2" className="flex justify-between py-[2px]">
                    Item Total
                    {renderPriceOrLoader(cartAmountTotal?.toFixed(2) || '0.00')}
                </Typography>

                <div>
                    {/* Delivery Fee Section */}
                    <Typography
                        variant="body2"
                        className={`flex justify-between ${!customerDetails ? 'blur-xs text-gray-400' : ''}`}
                    >
                        Delivery Fee
                        <span>
                            {customerDetails ? `€ ${deliveryFee.toFixed(2)}` : '0.00'}
                        </span>
                    </Typography>
                    <Divider className="my-2" />
                    {/* To Pay Section */}
                    <Typography
                        variant="body1"
                        className={`flex justify-between font-semibold ${!customerDetails ? 'blur-sm text-gray-400' : ''}`}
                    >
                        To Pay
                        <span>
                            {customerDetails
                                ? `€ ${((cartAmountTotal ?? 0) + deliveryFee ).toFixed(2)}`
                                : '0.00'}
                        </span>
                    </Typography>
                    {/* Show "Add address" button only if no customerDetails */}
                    {/* Hint & CTA */}
                    {!customerDetails && (
                        <Box className="flex flex-col items-center text-center mt-2 space-y-1">
                            <Typography variant="caption" color="textSecondary">
                                {order_type === OrderType.DELIVERY
                                    ? '🔓 Complete your details to unlock delivery & total'
                                    : '🔓 Let us know who’s picking this up'}
                            </Typography>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={handleAddressModalOpen}
                                sx={{ background: '#FF6347', color: 'white' }}
                            >
                                Add Details
                            </Button>
                        </Box>
                    )}

                </div>

                {/* <Typography
                    variant="body1"
                    className="flex justify-between py-[2px] font-semibold"
                >
                    To Pay
                    {customerDetails
                        ? renderPriceOrLoader(((cartAmountTotal ?? 0) + deliveryFee + deliveryTip).toFixed(2))
                        : renderPriceOrLoader((cartAmountTotal ?? 0).toFixed(2))}
                </Typography> */}
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

export default BillDetailWrapper;
