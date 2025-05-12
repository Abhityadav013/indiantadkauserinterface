'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Typography, Radio, RadioGroup, FormControlLabel, FormControl, IconButton, Box } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import Image from 'next/image';
import PaypalComponent from './PaypalComponent';
import StripeComponent from './StripeComponent';
import { convertToSubcurrency } from '@/utils/convertToSubCurrency';
import { Cart } from '@/lib/types/cart_type';
interface PaymentWrapperProps {
    cartData: Cart[]
}
const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cartData }) => {
    const stripeRef = useRef<HTMLDivElement | null>(null);
    const paypalRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [amountInCents, setAmountInCents] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe' | null>(null);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [isStripeLoaded, setIsStripeLoaded] = React.useState(false);
    const [isPaypalLoaded, setIsPaypalLoaded] = React.useState(false);
    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedMethod = event.target.value as 'paypal' | 'stripe';
        setPaymentMethod(selectedMethod);
    };
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
                            minHeight: { xs: '60vh', sm: '60vh', lg: '70vh' }, // Ensures there's enough scrollable space
                        }}
                    >
                        <StripeComponent
                            amount={amountInCents}
                            onLoad={() => setIsStripeLoaded(true)}  // Set it to true once Stripe is loaded
                        />
                    </Box>
                )
            }
        </>
    )
}

export default PaymentWrapper
