'use client';
import { Box, Button, Divider, Typography, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { OrderType } from '@/lib/types/order_type';
import { CustomerDetails } from '@/lib/types/customer_order_type';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import InfoIcon from '@mui/icons-material/Info';
import DeliveryFeeDialog from '../DeliveryFeeDialog';
import ServiceFeeDilaog from '../ServiceFeeDilaog';
import { formatPrice } from '@/utils/valueInEuros';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MinimumOrderDialog from './MinimumOrderDialog';
import { handleBasketState } from '@/store/slices/basketSlice';

interface BillDetailWrapperProps {
    basketId: string,
    customerDetails: CustomerDetails;
    getCartTotal: () => number;
    handleAddressModalOpen: () => void;
}

const BillDetailWrapper = ({
    basketId,
    customerDetails,
    getCartTotal,
    handleAddressModalOpen
}: BillDetailWrapperProps) => {
    const [loading, setLoading] = useState(true);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [cartAmountTotal, setCartAmountTotal] = useState<number>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [serviceFeeDialogOpen, setServiceFeeDialogOpen] = useState(false);
    const [minimumDialogOpen, setMinimumDialogOpen] = useState(false)
    const order_type = useSelector((state: RootState) => state.order.orderType);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderTypeParam = searchParams.get('orderType') as OrderType | null;

    useEffect(() => {
        const deliveryFee = sessionStorage.getItem('deliveryFee');
        setDeliveryFee(deliveryFee ? Number(deliveryFee) : 0);
    }, []);

    useEffect(() => {
        const cartTotal = getCartTotal();
        if (cartTotal) {
            const total = ((cartTotal ?? 0) + deliveryFee).toFixed(2);
            sessionStorage.setItem('cartTotalAmount', total);
            setCartAmountTotal(Number(cartTotal));
            setLoading(false);
        }
    }, [getCartTotal, deliveryFee]);

    const renderPriceOrLoader = (value: string | number) => {
        if (loading) return (
            <span className="inline-flex space-x-1 items-center">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>

        )
        if (value === 0) return <span>Free</span>;
        return <span>{formatPrice(Number(value))}</span>;
    };

    const renderServiceFee = (value: string | number) => {
        if (loading) return (
            <span className="inline-flex space-x-1 items-center">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>

        );
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

    const handleCheckout = () => {
        if (order_type === OrderType.PICKUP && (customerDetails?.name === '' || customerDetails.name === undefined || customerDetails.name == null)) {
            return handleAddressModalOpen()
        }

        if (order_type === OrderType.DELIVERY && (!customerDetails.address || Object.keys(customerDetails.address).length == 0 || customerDetails?.address?.pincode === '')) {
            return handleAddressModalOpen()
        }

        if (cartAmountTotal && cartAmountTotal < 10) {
            return setMinimumDialogOpen(true)
        }
        router.push(`/checkout?basket=${basketId}&orderType=${orderTypeParam ?? order_type}`)
    }
    const handleShopMore = () => {
        setMinimumDialogOpen(false)
        dispatch(handleBasketState(false));
    }
    return (
        <>

            <Box sx={{ position: 'relative', paddingBottom: '5px', height: '25vh' }} className="mt-2 text-gray-700">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={order_type || OrderType.DELIVERY}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden', position: 'relative' }}
                    >
                        <Box>
                            <Typography variant="body2" className="flex justify-between py-[2px]">
                                Item Total
                                {renderPriceOrLoader(cartAmountTotal?.toFixed(2) || '0.00')}
                            </Typography>

                            {order_type === OrderType.DELIVERY && (
                                <>

                                    <Typography
                                        variant="body1"
                                        className={`flex justify-between font-semibold`}
                                    >
                                        <span>
                                            Delivery Fee
                                            <IconButton onClick={handleDialogOpen} sx={{ paddingLeft: '5px' }}>
                                                <InfoIcon sx={{ fontSize: 12 }} />
                                            </IconButton>
                                        </span>
                                        {renderPriceOrLoader(deliveryFee)}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        className={`flex justify-between font-semibold`}
                                    >
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

                            {
                                Object.keys(customerDetails).length > 0 && <Divider sx={{ backgroundColor: '#E0E0E0', my: 1 }} />
                            }


                            <Typography
                                variant="body1"
                                className={`flex justify-between font-bold`}
                            >
                                Total
                                <span>
                                    {`€ ${calculateTotal()}`}
                                </span>
                            </Typography>
                        </Box>

                        {/* Mask with message */}
                    </motion.div>
                </AnimatePresence>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        mt: 2
                    }}
                >
                    <Button
                        variant="contained"
                        hidden={!customerDetails || Object.keys(customerDetails).length === 0}
                        onClick={handleCheckout}
                        sx={{
                            width: '100%',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            borderRadius: 50,
                            mt: 4,
                            py: 1.5,
                            backgroundColor: '#FF6347',
                            color: 'white',
                            '&:hover': { backgroundColor: '#e5533d' },
                            '&[aria-disabled="true"]': { opacity: 0.5, cursor: 'not-allowed' },
                        }}
                        disabled={Boolean(cartAmountTotal && cartAmountTotal < 10)}
                        aria-disabled={Boolean(cartAmountTotal && cartAmountTotal < 10)}
                        title={cartAmountTotal && cartAmountTotal < 10 ? 'Minimum order is 10€' : cartAmountTotal?.toString()}
                    >
                       {cartAmountTotal && cartAmountTotal < 10 ? 'Minimum order is 10 €' : `Checkout ${formatPrice(Number(cartAmountTotal))}`}
                    </Button>
                </Box>

            </Box>
            <MinimumOrderDialog open={minimumDialogOpen}
                onClose={() => setMinimumDialogOpen(false)}
                onShopMore={handleShopMore} // callback to redirect or close dialog for adding more items
                currentAmount={cartAmountTotal ?? 0} />

            {/* Dialogs */}
            <DeliveryFeeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
            <ServiceFeeDilaog open={serviceFeeDialogOpen} onClose={() => setServiceFeeDialogOpen(false)} />
        </>
    );
};

export default BillDetailWrapper;
