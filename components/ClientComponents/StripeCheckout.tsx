'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { Box } from '@mui/material';
import Image from 'next/image';

interface StripeCheckoutProps {
    amount: number,
    onClientSecretLoad: () => void
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, onClientSecretLoad }) => {
    const [showLoader, setShowLoader] = useState(true);
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    const hasFetched = useRef(false); // <- to track first-time API call

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchPaymentIntent = async () => {
            const res = await fetch("/api/v1/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount })
            });

            const data = await res.json();
            setClientSecret(data.clientSecret);
            onClientSecretLoad()
        };

        fetchPaymentIntent();
    }, [amount, onClientSecretLoad]);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (clientSecret && stripe && elements) {
                setShowLoader(false);
                // trigger parent scroll logic
            }
        }, 3000); // ⏱ Minimum 2s loader

        return () => clearTimeout(timer);
    }, [clientSecret, stripe, elements]);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!stripe || !elements) {
            return;
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const response = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'https://theindiantadka.vercel.app/payment-success',
            },
        });
        if (response.error) {
            setErrorMessage(response.error.message);
        } else {
            // Payment successful logic here (e.g., redirect to success page)
        }
        setLoading(false);
    };

    if (showLoader) {
        return (
            <Box
                sx={{
                    width: '100%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center',
                    height:'50vh'
                }}
            >
                <Image
                    src='https://testing.indiantadka.eu/assets/paymentLoading.gif'
                    alt="Loading..."
                    width={400}
                    height={400} // Assuming the image is square
                />
            </Box>
        );
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="p-2 rounded-md w-full max-w-md sm:max-w-sm">
            <PaymentElement />

            {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}

            <button
                disabled={!stripe || loading}
                className={`w-full mt-4 rounded-md font-bold 
                    text-xl py-4 
                    sm:text-lg sm:py-3 
                    ${loading ? 'bg-gray-400' : 'bg-black text-white'}`}>
                {!loading ? `Pay ${amount / 100} €` : "Processing..."}
            </button>
        </form>

    );
}

export default StripeCheckout
