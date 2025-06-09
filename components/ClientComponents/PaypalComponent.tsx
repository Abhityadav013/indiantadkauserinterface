'use client'

import React, { useEffect, useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Image from 'next/image';
import { Box } from '@mui/material';
import { convertToSubcurrency } from '@/utils/convertToSubCurrency';
interface PaypalComponentProps {
    amount: number,
}

const PaypalComponent: React.FC<PaypalComponentProps> = ({ amount }) => {
    const [orderId, setOrderId] = useState<string | null>(null);
    const [showLoader, setShowLoader] = useState(true);
    const isOrderCreatedRef = useRef(false);
      const orderPrice = convertToSubcurrency(amount)
    const amountRef = useRef(orderPrice);

    useEffect(() => {
        // Track the latest values of amount and order
        amountRef.current = amount;
    }, [amount]); // Ensure that refs are updated with latest values


    useEffect(() => {
        if (isOrderCreatedRef.current) return; // prevent repeat fetch
        isOrderCreatedRef.current = true;
        // Create order on the server when the component mounts and when amount/order change
        const createOrder = async () => {
            try {
                const response = await fetch('/api/v1/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: amountRef.current }),
                });
                const data = await response.json();

                if (response.ok) {
                    setOrderId(data.id);
                    // isOrderCreatedRef.current = true; // Only set order created flag after successful response
                } else {
                    throw new Error(data.message || 'Failed to create order');
                }
            } catch (error) {
                console.error('Error creating PayPal order:', error);
            }
        };

        createOrder();
    }, []); // Empty dependency array ensures it runs once on mount

    useEffect(() => {
        const timer = setTimeout(() => {
            if (orderId) {
                setShowLoader(false);
                // trigger parent scroll logic
            }
        }, 2000); // ⏱ Minimum 2s loader

        return () => clearTimeout(timer);
    }, [orderId]);

    if (showLoader) {
        return (
            <Box
                sx={{
                    width: '100%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center',
                    height:'20vh'
                }}
            >
                <Image
                    src='https://testing.indiantadka.eu/assets/paymentLoading.gif'
                    alt="Loading..."
                    width={300}
                    height={100} // Assuming the image is square
                />
            </Box>
        );
    }

    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
            <div className="paypal-button-container">
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: 'CAPTURE', // Specify intent here
                            purchase_units: [
                                {
                                    amount: {
                                        value: (amount / 100).toFixed(2), // Convert amount from cents to dollars
                                        currency_code: 'USD',
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={async (data, actions) => {
                        if (actions.order) {
                            const order = await actions.order.capture();
                            console.log('Payment Successful!', order);
                            window.location.href = '/payment-success';
                        } else {
                            console.error('PayPal actions.order is undefined');
                        }
                        console.log('Payment Successful!', actions.order);
                        window.location.href = '/payment-success';
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err);
                        window.location.href = '/payment-cancel';
                    }}
                />

            </div>
        </PayPalScriptProvider>
    );
};

export default PaypalComponent;