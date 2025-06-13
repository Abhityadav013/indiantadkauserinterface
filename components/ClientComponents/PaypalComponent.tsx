'use client'

import React, { useEffect, useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Box } from '@mui/material';
interface PaypalComponentProps {
    amount: number,
}

const PaypalComponent: React.FC<PaypalComponentProps> = ({ amount }) => {
    const [orderId, setOrderId] = useState<string | null>(null);
    const isOrderCreatedRef = useRef(false);
    const amountRef = useRef(amount);

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
    if (!orderId)
        return null;

    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                components: 'buttons',
                // fundingSource: 'paypal', // Ensures only PayPal wallet is shown
            }}
        >
            <Box className="w-full">
                <div className="paypal-button-container w-full !overflow-visible">
                    <PayPalButtons
                        fundingSource="paypal" // 💡 This ensures only PayPal wallet button shows
                        style={{
                            layout: 'horizontal',
                            tagline: true, // Tagline only shows for horizontal
                            color: 'gold',
                            shape: 'rect',
                            label: 'paypal',
                            height: 55, // Optional
                        }}
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
            </Box>
            {/* <div className="paypal-button-container">
         

            </div> */}
        </PayPalScriptProvider>
    );
};

export default PaypalComponent;