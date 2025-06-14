'use client'

import React, { useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter, useSearchParams } from 'next/navigation';
interface PaypalComponentProps {
    amount: number,
}

const PaypalComponent: React.FC<PaypalComponentProps> = ({ amount }) => {
    const searchParams = useSearchParams(); // URLSearchParams
    const [orderId, setOrderId] = useState('')
    const basketParam = searchParams.get('basket') || '';
    const router = useRouter()
    const isOrderCreatedRef = useRef(false);
    async function onApprove(data: { orderID: string }): Promise<void> {
        try {
            const response = await fetch(`/api/v1/paypal/capture-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderID: data.orderID, basketId: basketParam }),
            });
            const payData = await response.json();

            router.push(`/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${payData.orderId}`)
        } catch (error) {
            console.log(error)
            //return `Sorry, your transaction could not be processed...${error}`;
        }
    }

    const onclick = async (): Promise<string> => {
        if (isOrderCreatedRef.current) return orderId; // prevent repeat fetch
        isOrderCreatedRef.current = true;
        const requestBody = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        value: (amount / 100).toFixed(2),
                        currency_code: 'EUR',
                    },
                },
            ],
            application_context: {
                return_url: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/checkout${basketParam ? '?basket=' + basketParam : ''}`,
                cancel_url: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/checkout${basketParam ? '?basket=' + basketParam : ''}`,
            },
        };

        const res = await fetch('/api/v1/paypal/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        if (res.ok) {
            setOrderId(data.id)
            return data.id;
        }

        console.error('PayPal order creation failed', data);
        return '';
    };


    return (
        <div className="card_container">
            <PayPalScriptProvider
                options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                    components: 'buttons',
                    currency: "EUR",

                }}
            >
                <PayPalButtons
                    fundingSource="paypal"
                    style={{
                        shape: "pill",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                        height: 55,
                    }}
                    // onInit={onclick}
                    createOrder={onclick}
                    onApprove={async (data) => await onApprove(data)}
                />

            </PayPalScriptProvider>
        </div>

    );
};

export default PaypalComponent;