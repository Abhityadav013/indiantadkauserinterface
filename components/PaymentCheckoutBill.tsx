import React from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { OrderType } from '@/lib/types/order_type';

interface PaymentCheckoutBillProps {
    isDeliveryOrder: boolean;
    cartTotal: number;
    deliveryFee: string;
    deliveryTip: string;
    isFreeDelivery: boolean;
}
const PaymentCheckoutBill: React.FC<PaymentCheckoutBillProps> = ({
    isDeliveryOrder,
    cartTotal,
    deliveryFee,
    deliveryTip,
    isFreeDelivery,
}) => {
    return (
        <Box 
        sx={{
             width: { xs: '100%', sm: '100%', lg: '80%' },
             background:'white',
             p:4
        }}
       >
            <Typography variant="h6" className="font-semibold">
                <IconButton>
                    <ReceiptIcon fontSize="medium" className="text-gray-700" />
                </IconButton>
                Bill Details
            </Typography>
            <Box className="mt-2 text-gray-700 space-y-1">
                <Typography variant="body2" className="flex justify-between">
                    Order Type
                    <span className="text-orange-600 font-bold">
                        {isDeliveryOrder ? OrderType.DELIVERY : OrderType.PICKUP}
                    </span>
                </Typography>
                <Typography variant="body2" className="flex justify-between">
                    Item Total <span>€{cartTotal}</span>
                </Typography>
                {isDeliveryOrder && (
                    <>
                        <Typography variant="body2" className="flex justify-between">
                            Delivery Fee
                            <span
                                className={
                                    !deliveryFee ? `text-emerald-600 text-xs cursor-pointer` : ''
                                }
                            >{`€${deliveryFee}`}</span>
                        </Typography>

                        {
                            deliveryTip && (
                                <>
                                    <Typography variant="caption" className="text-gray-500">
                                        This fee fairly goes to our delivery partners for delivering your
                                        food
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className={`flex justify-between ${deliveryTip ? '' : 'text-orange-500 cursor-pointer'
                                            } `}
                                    >
                                        Delivery Tip{' '}
                                        {deliveryTip ? (
                                            <span>€{deliveryTip}</span>
                                        ) : isFreeDelivery ? (
                                            <span>Free</span>
                                        ) : null}
                                    </Typography>
                                </>)
                        }

                    </>
                )}
                <Divider className="my-2" />
                <Typography
                    variant="body1"
                    className="flex justify-between font-semibold"
                >
                    To Pay
                    <span>€{cartTotal.toFixed(2)}</span>
                </Typography>
            </Box>
        </Box>
    );
};

export default PaymentCheckoutBill;
