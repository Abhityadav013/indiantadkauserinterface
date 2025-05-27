'use client'
import DeliveryFeeDialog from '@/components/DeliveryFeeDialog';
import ServiceFeeDilaog from '@/components/ServiceFeeDilaog';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info';
import { CustomerOrder } from '@/lib/types/customer_order_type';
import { OrderType } from '@/lib/types/order_type';
import { formatPrice } from '@/utils/valueInEuros';
import { MenuItem } from '@/lib/types/menu_type';
import { Cart } from '@/lib/types/cart_type';
// Calculate totals
interface BillInfoProps {
    userData: CustomerOrder,
    cart: Cart[];
    menu: MenuItem[];
}
const BillInfo = ({ userData, cart, menu }: BillInfoProps) => {
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
    const [serviceFeeDialogOpen, setServiceFeeDialogOpen] = useState(false); // State to control dialog visibility
    // Function to handle opening the dialog
    const handleDialogOpen = () => setDialogOpen(true);

    const handleServiceFeeDialogOpen = () => setServiceFeeDialogOpen(true);

    const renderPriceOrLoader = (value: string | number) => {
        if (value === 0) {
            return <span>Free</span>
        } else {
            return <span>{formatPrice(Number(value))}</span>
        }
    }

    const getCartTotal = () => {
        return cart.reduce((total, cartItem) => {
            const foodItemMatch = menu.find((item) => item.id === cartItem.itemId);
            return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
        }, 0);
    };



    const renderServiceFee = (value: string | number) => {
        const serviceFee = (Number(value) * 2.5) / 100;
        if (serviceFee < 0.99) {
            return <span>{formatPrice(Number(serviceFee.toFixed(2)))}</span>;  // Ensure we are returning the fee with the € symbol
        }

        return <span>€0,99</span>;  // Return the capped fee with the € symbol
    };

    const cartAmountTotal = ((getCartTotal() ?? 0)).toFixed(2);

    // Calculate the total (cartTotal + deliveryFee + serviceFee)
    const calculateTotal = () => {
        const serviceFee = (cartAmountTotal ? (Number(cartAmountTotal) * 2.5) / 100 : 0);
        const cappedServiceFee = serviceFee < 0.99 ? serviceFee : 0.99;

        return formatPrice((Number(cartAmountTotal) ?? 0) + Number(userData?.customerDetails?.deliveryFee ?? 0) + cappedServiceFee);
    }



    return (
        <>
            <Box className="my-4">
                <Box className="flex justify-between mb-0.2">
                    <Typography variant="body2" fontWeight="bold">
                        Subtotal

                    </Typography>
                    <Typography variant="body2">{formatPrice(Number(cartAmountTotal))}</Typography>
                </Box>

                {userData.orderType === OrderType.DELIVERY && (
                    <>
                        <Typography variant="body2" className="flex justify-between">
                            <span>
                                Delivery Fee
                                <IconButton onClick={handleDialogOpen} sx={{ paddingLeft: '5px' }}>
                                    <InfoIcon sx={{ fontSize: 12 }} /> {/* You can adjust the font size here */}
                                </IconButton>
                            </span>

                            {renderPriceOrLoader(userData?.customerDetails?.deliveryFee ?? 0)}

                        </Typography>
                        <Typography variant="body2" className="flex justify-between">
                            <span>
                                Service fee 2.5% (max 0.99 €)
                                <IconButton onClick={handleServiceFeeDialogOpen} sx={{ paddingLeft: '5px' }}>
                                    <InfoIcon sx={{ fontSize: 12 }} /> {/* You can adjust the font size here */}
                                </IconButton>
                            </span>

                            {renderServiceFee(cartAmountTotal || '0,00')}

                        </Typography>
                    </>
                )}
                {/* <Box className="flex justify-between items-center mb-1">
                    <Box className="flex items-center space-x-0.5">
                        <Typography variant="body2">Delivery Fee</Typography>
                        <IconButton onClick={handleDialogOpen} sx={{ padding: '2px', width: 20, height: 20 }}>
                            <InfoIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                    </Box>
                    <Typography variant="body2">€{deliveryFee.toFixed(2)}</Typography>
                </Box>

                <Box className="flex justify-between items-center mb-1">
                    <Box className="flex items-center space-x-0.5">
                        <Typography variant="body2">Service Fee</Typography>
                        <IconButton onClick={handleServiceFeeDialogOpen} sx={{ padding: '2px', width: 20, height: 20 }}>
                            <InfoIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                    </Box>
                    <Typography variant="body2">€{serviceFee.toFixed(2)}</Typography>
                </Box> */}
            </Box>

            <Divider className="mb-4" />

            <Box className="flex justify-between mb-6">
                <Typography variant="h6" className="font-bold">
                    Total
                </Typography>
                <Typography variant="h6" className="font-bold">
                    {calculateTotal()}
                </Typography>
            </Box>

            <DeliveryFeeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
            <ServiceFeeDilaog open={serviceFeeDialogOpen} onClose={() => setServiceFeeDialogOpen(false)} />

        </>
    )
}

export default BillInfo
