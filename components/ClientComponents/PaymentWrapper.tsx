'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Typography, Radio, RadioGroup, FormControlLabel, FormControl, IconButton, Box } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import Image from 'next/image';
import PaypalComponent from './PaypalComponent';
import StripeComponent from './StripeComponent';
import { convertToSubcurrency } from '@/utils/convertToSubCurrency';
import { Cart } from '@/lib/types/cart_type';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useUpdateCartMutation } from '@/store/api/cartApi';
import { useOrderDetails } from '@/hooks/userOrderDetails';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import { OrderType } from '@/lib/types/order_type';
import { ApiError } from '@/utils/ApiResponse';
import { useRouter } from 'next/navigation';
interface PaymentWrapperProps {
    cartData: Cart[]
}
const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cartData }) => {
    const stripeRef = useRef<HTMLDivElement | null>(null);
    const paypalRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [amountInCents, setAmountInCents] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe' | 'cash' | null>(null);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [isStripeLoaded, setIsStripeLoaded] = React.useState(false);
    const [isPaypalLoaded, setIsPaypalLoaded] = React.useState(false);
    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedMethod = event.target.value as 'paypal' | 'stripe' | 'cash';
        setPaymentMethod(selectedMethod);
    };
    const [updateCart] = useUpdateCartMutation();
    const { handleOrderCreation } = useOrderDetails()
    const { customerOrder } = useAddressDetails();

    useEffect(() => {
        const checkCartTotalAmount = () => {
            const cartAmount = sessionStorage.getItem('cartTotalAmount');
            if (cartAmount) {
                setCartTotal(Number(cartAmount));
            }
        };
        checkCartTotalAmount();
    }, [cartTotal]);


    useEffect(() => {
        const fetchAmountInCents = async () => {
            const convertedAmount = await convertToSubcurrency(cartTotal);
            setAmountInCents(convertedAmount);  // Set the converted value to state
            setLoading(true);
        };

        fetchAmountInCents();
    }, [cartTotal]);


    useEffect(() => {
        if (isStripeLoaded) {
            stripeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (isPaypalLoaded) {
            paypalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isStripeLoaded, isPaypalLoaded]);

    const handleOrderPlaced = async () => {
        try {
            const deliveryFee = sessionStorage.getItem('deliveryFee');
            const tipAmount = sessionStorage.getItem('tipAmount');
            const orderCreatedResponse = await handleOrderCreation({
                orderDetails: cartData,
                orderType: customerOrder?.orderType as OrderType,
                paymentIntentId: '',
                ...deliveryFee && { deliveryFee: parseFloat(deliveryFee) },
                ...tipAmount && { tipAmount: parseFloat(tipAmount) }
            });
            if (!orderCreatedResponse) {
                throw new Error('Order creation failed: No response received.');
            }
            if (orderCreatedResponse.orderId) {
                updateCart({ cart: [], isCartEmpty: true });
                const timer = setTimeout(() => {
                    router.replace(`/order-confirmation?orderId=${orderCreatedResponse.displayId}`)
                    // router.push(`/order-confirmation?orderId=${orderCreatedResponse?.displayId}`);
                }, 1000); // ⏱ Minimum 2s loader

                return () => clearTimeout(timer);
            }
        } catch (error) {
            if (error instanceof ApiError) {
                console.error('API Error:', error.message);
                // Optionally show error.message or error.validationErrors in UI
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }

    if (!loading && amountInCents <= 0 || cartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
        );
    }

    return (
        <>
            <Box
                sx={{
                    width: { xs: '100%', sm: '100%', lg: '80%' },
                    background: 'white',
                    p: 4
                }}>
                <Typography variant="h6" className="font-semibold">
                    <IconButton>
                        <PaymentIcon fontSize="medium" className="text-gray-700" />
                    </IconButton>
                    Pay via
                </Typography>
                <Box sx={{ marginLeft: '20px', marginTop: '5px' }}>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            aria-label="payment-method"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                            className="space-y-4"
                        >
                            <FormControlLabel
                                value="paypal"
                                control={<Radio />}
                                label={
                                    <span className="flex items-center gap-2">
                                        <Image src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" width={24} height={24} />
                                        Pay with PayPal
                                    </span>
                                }
                            />
                            <FormControlLabel
                                value="stripe"
                                control={<Radio />}
                                label={
                                    <span className="flex items-center gap-2">
                                        <Image src="https://stripe.com/img/v3/home/twitter.png" alt="Stripe" width={24} height={24} />
                                        Pay with Stripe
                                    </span>
                                }
                            />
                            <FormControlLabel
                                value="cash"
                                control={<Radio />}
                                label={
                                    <span className="flex items-center gap-2">
                                        <AttachMoneyIcon />
                                        Pay with Cash
                                    </span>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
            {paymentMethod === 'paypal' && amountInCents > 0 && cartData.length > 0 && (
                <Box
                    ref={paypalRef}
                    sx={{
                        width: { xs: '100%', sm: '100%', lg: '80%' },
                        background: 'white',
                        p: 4,
                        minHeight: { xs: '30vh', sm: '30vh', lg: '40vh' }, // Ensures there's enough scrollable space
                    }}
                >
                    <PaypalComponent amount={amountInCents} onLoad={() => setIsPaypalLoaded(true)} />
                </Box>
            )}

            {
                paymentMethod === 'stripe' && amountInCents > 0 && cartData.length > 0 && (
                    <Box
                        ref={stripeRef}
                        sx={{
                            width: { xs: '100%', sm: '100%', lg: '80%' },
                            background: 'white',
                            p: 4,
                            minHeight: { xs: '60vh', sm: '60vh', lg: '70vh' },
                            maxHeight: '100vh',
                            overflow: 'auto',  // Make sure content is scrollable
                        }}
                    >
                        <StripeComponent amount={amountInCents} onLoad={() => setIsStripeLoaded(true)} />
                    </Box>
                )
            }
            {
                paymentMethod === 'cash' && amountInCents > 0 && cartData.length > 0 && (
                    <button
                        onClick={handleOrderPlaced}
                        className="w-full lg:w-4/5 mt-4 rounded-md font-bold text-xl py-4 sm:text-lg sm:py-3 text-white bg-[#FF6347]">
                        Place Order
                    </button>
                )
            }
        </>
    )
}

export default PaymentWrapper
