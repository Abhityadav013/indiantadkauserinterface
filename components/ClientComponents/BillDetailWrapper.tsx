'use client';
import { Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { OrderType } from '@/lib/types/order_type';
import Image from 'next/image';
import { MenuItem } from '@/lib/types/menu_type';
import { useCart } from '@/hooks/useCartDetails';


interface BillDetailWrapperProps {
    menu: MenuItem[]
}
const BillDetailWrapper: React.FC<BillDetailWrapperProps> = ({ menu }) => {
    const [loading, setLoading] = useState(true);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryTip, setDeliveryTip] = useState(0);
    const [isDeliveryOrder, setOrderType] = useState<boolean>()
    const [isFreeDelivery, setFreeDelivery] = useState(false);
    const [cartAmountTotal, setCartAmountTotal] = useState<number>();
    const { menuItems, updateMenuItems, getCartTotal } = useCart();

    useEffect(() => {
        if (!menuItems.length) {
            updateMenuItems(menu)
        }
    }, [menuItems, menu, updateMenuItems])

    useEffect(() => {
        const deliveryFee = sessionStorage.getItem('deliveryFee');
        const freeDelivery = sessionStorage.getItem('freeDelivery');
        const orderType = sessionStorage.getItem('orderType');
        setDeliveryFee(deliveryFee ? Number(deliveryFee) : 0)
        setFreeDelivery(freeDelivery === 'true')
        setOrderType(orderType === OrderType.DELIVERY)

    }, [])

    // Load customer delivery details

    // Load tip from session storage
    useEffect(() => {
        const tip = sessionStorage.getItem('tipAmount');
        setDeliveryTip(tip ? Number(tip) : 0);
    }, []);

    // Update cart total in session storage, and set loading timeout
    useEffect(() => {
        const cartTotal = getCartTotal()
        if (cartTotal) {
            const total = ((cartTotal ?? 0) + deliveryFee + deliveryTip).toFixed(2);
            sessionStorage.setItem('cartTotalAmount', total);
            setCartAmountTotal(Number(total))
            setLoading(false);
        }
    }, [getCartTotal, deliveryFee, deliveryTip]);


    const addTipToDelivery = () => {
        sessionStorage.setItem('tipAmount', '3');
        setDeliveryTip(3);
    };

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

    return (
        <Box className="mt-2 text-gray-700 space-y-3">
            <Typography variant="body2" className="flex justify-between">
                Order Type
                <span className="text-orange-500 font-bold">
                    {isDeliveryOrder ? OrderType.DELIVERY : OrderType.PICKUP}
                </span>
            </Typography>

            <Typography variant="body2" className="flex justify-between">
                Item Total
                {renderPriceOrLoader(cartAmountTotal?.toFixed(2) || '0.00')}
            </Typography>

            {isDeliveryOrder && (
                <div className="space-y-2">
                    <Typography variant="body2" className="flex justify-between">
                        Delivery Fee
                        <span className={!deliveryFee ? 'text-emerald-600 text-xs cursor-pointer' : ''}>
                            {/* {!isCustomerDetailsPresent ? 'Add Delivery Address' : renderPriceOrLoader(deliveryFee)} */}
                        </span>
                    </Typography>

                    <Typography variant="caption" className="text-gray-500">
                        This fee fairly goes to our delivery partners for delivering your food
                    </Typography>

                    <Typography
                        variant="body2"
                        className={`flex justify-between ${deliveryTip ? '' : 'text-orange-500 cursor-pointer'}`}
                    >
                        Delivery Tip{' '}
                        {deliveryTip ? (
                            <span>€{deliveryTip}</span>
                        ) : isFreeDelivery ? (
                            <span>Free</span>
                        ) : (
                            <span onClick={addTipToDelivery}>Add tip</span>
                        )}
                    </Typography>
                </div>
            )}

            <Divider className="my-2" />

            <Typography
                variant="body1"
                sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}
            >
                To Pay
                {renderPriceOrLoader(((cartAmountTotal ?? 0) + deliveryFee + deliveryTip).toFixed(2))}
            </Typography>
        </Box>

    );
};

export default BillDetailWrapper;
