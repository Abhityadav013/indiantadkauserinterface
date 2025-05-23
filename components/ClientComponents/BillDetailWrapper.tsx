'use client';
import { Box, Button, Divider, Typography, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { OrderType } from '@/lib/types/order_type';
import { CustomerDetails } from '@/lib/types/customer_order_type';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import InfoIcon from '@mui/icons-material/Info';
import DeliveryFeeDialog from '../DeliveryFeeDialog';
import ServiceFeeDilaog from '../ServiceFeeDilaog';
import { formatPrice } from '@/utils/valueInEuros';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface BillDetailWrapperProps {
    customerDetails: CustomerDetails;
    getCartTotal: () => number;
    handleAddressModalOpen: (value: boolean) => void;
}

const BillDetailWrapper = ({
    customerDetails,
    getCartTotal,
    handleAddressModalOpen
}: BillDetailWrapperProps) => {
    const [loading, setLoading] = useState(true);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [cartAmountTotal, setCartAmountTotal] = useState<number>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [serviceFeeDialogOpen, setServiceFeeDialogOpen] = useState(false);
    const order_type = useSelector((state: RootState) => state.order.orderType);
    const router = useRouter();

    useEffect(() => {
        const deliveryFee = sessionStorage.getItem('deliveryFee');
        setDeliveryFee(deliveryFee ? Number(deliveryFee) : 0);
    }, []);

    useEffect(() => {
        const cartTotal = getCartTotal();
        if (cartTotal) {
            const total = ((cartTotal ?? 0) + deliveryFee).toFixed(2);
            sessionStorage.setItem('cartTotalAmount', total);
            setCartAmountTotal(Number(total));
            setLoading(false);
        }
    }, [getCartTotal, deliveryFee]);

    const renderPriceOrLoader = (value: string | number) => {
        if (loading) return <span>Loading...</span>;
        if (value === 0) return <span>Free</span>;
        return <span>{formatPrice(Number(value))}</span>;
    };

    const renderServiceFee = (value: string | number) => {
        if (loading) return <span>Loading...</span>;
        const serviceFee = (Number(value) * 2.5) / 100;
        return <span>{formatPrice(serviceFee < 0.99 ? Number(serviceFee.toFixed(2)) : 0.99)}</span>;
    };

    const calculateTotal = () => {
        if (order_type === OrderType.DELIVERY) {
            const serviceFee = cartAmountTotal ? (cartAmountTotal * 2.5) / 100 : 0;
            const cappedServiceFee = serviceFee < 0.99 ? serviceFee : 0.99;
            return formatPrice((cartAmountTotal ?? 0) + deliveryFee + cappedServiceFee);
        }
        return formatPrice(cartAmountTotal ?? 0);
    };

    const handleDialogOpen = () => setDialogOpen(true);
    const handleServiceFeeDialogOpen = () => setServiceFeeDialogOpen(true);
    console.log('BillDetailWrapper customerDetails', customerDetails)
    return (
        <>
            <Box sx={{ position: 'relative', paddingBottom: '100px' }} className="mt-2 text-gray-700">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={order_type}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <Typography variant="body2" className="flex justify-between py-[2px]">
                            Item Total
                            {renderPriceOrLoader(cartAmountTotal?.toFixed(2) || '0.00')}
                        </Typography>

                        {order_type === OrderType.DELIVERY && (
                            <>
                                <Typography variant="body2" className="flex justify-between">
                                    <span>
                                        Delivery Fee
                                        <IconButton onClick={handleDialogOpen} sx={{ paddingLeft: '5px' }}>
                                            <InfoIcon sx={{ fontSize: 12 }} />
                                        </IconButton>
                                    </span>
                                    {renderPriceOrLoader(deliveryFee)}
                                </Typography>

                                <Typography variant="body2" className="flex justify-between">
                                    <span>
                                        Service fee 2.5% (max 0.99 €)
                                        <IconButton onClick={handleServiceFeeDialogOpen} sx={{ paddingLeft: '5px' }}>
                                            <InfoIcon sx={{ fontSize: 12 }} />
                                        </IconButton>
                                    </span>
                                    {renderServiceFee(cartAmountTotal?.toFixed(2) || '0.00')}
                                </Typography>
                            </>
                        )}

                        <Divider sx={{ backgroundColor: '#E0E0E0', my: 1 }} />

                        <Typography
                            variant="body1"
                            className={`flex justify-between font-semibold ${!customerDetails ? 'blur-sm text-gray-400' : ''}`}
                        >
                            Total
                            <span>
                                {customerDetails ? `€ ${calculateTotal()}` : '0.00'}
                            </span>
                        </Typography>

                        {!customerDetails || Object.keys(customerDetails).length === 0 && (
                            <Box className="flex flex-col items-center text-center space-y-1 mt-2">
                                <Typography variant="h6" color="textSecondary">
                                    {order_type === OrderType.DELIVERY
                                        ? '🔓 Complete your details to unlock delivery & total'
                                        : '🔓 Let us know who’s picking this up'}
                                </Typography>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={() => handleAddressModalOpen(true)}
                                    sx={{ background: '#FF6347', color: 'white' }}
                                >
                                    Add Details
                                </Button>
                            </Box>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Checkout Button - absolutely positioned inside this container */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => router.push('/checkout')}
                        sx={{
                            width: '100%',
                            backgroundColor: '#f36805',
                            color: 'white',
                            padding: '12px 24px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#f36805',
                            },
                        }}
                    >
                        Checkout ({calculateTotal()})
                    </Button>
                </Box>
            </Box>

            {/* Dialogs */}
            <DeliveryFeeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
            <ServiceFeeDilaog open={serviceFeeDialogOpen} onClose={() => setServiceFeeDialogOpen(false)} />
        </>
    );
};

export default BillDetailWrapper;
