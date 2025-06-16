'use client';

import React, { useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { removeCoupon } from '@/store/slices/discountCoupon';
interface PaypalComponentProps {
    cartAmount: number;
    finalCartAmount: number;
    amount: number;
}

const PaypalComponent: React.FC<PaypalComponentProps> = ({
    cartAmount,
    finalCartAmount,
    amount,
}) => {
    const searchParams = useSearchParams(); // URLSearchParams
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false); // 👈 New loading state
    const basketParam = searchParams.get('basket') || '';
    const couponApplied = searchParams.get('coupon') || null;
    const router = useRouter();
    const isOrderCreatedRef = useRef(false);
    const dispatch = useDispatch()
    async function onApprove(data: { orderID: string }): Promise<void> {
        try {
            const response = await fetch(`/api/v1/paypal/capture-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    basketId: basketParam,
                    ...(couponApplied && {
                        discount: {
                            code: couponApplied,
                            amount: Number((cartAmount - finalCartAmount).toFixed(2)),
                        },
                    }),
                }),
            });
            const payData = await response.json();
            if (response.ok) {
                dispatch(removeCoupon())
                router.push(
                    `/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${payData.orderId}`
                );
            }

        } catch (error) {
            console.log(error);
            //return `Sorry, your transaction could not be processed...${error}`;
        } finally {
            setLoading(false); // 👈 Stop loader
        }
    }

    const onclick = async (): Promise<string> => {
        if (isOrderCreatedRef.current) return orderId; // prevent repeat fetch
        isOrderCreatedRef.current = true;
        setLoading(true);
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
            setOrderId(data.id);
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
                    currency: 'EUR',
                }}
            >
                <div className="relative">
                    <PayPalButtons
                        fundingSource="paypal"
                        style={{
                            shape: 'pill',
                            layout: 'vertical',
                            color: 'gold',
                            label: 'paypal',
                            height: 55,
                        }}
                        createOrder={onclick}
                        onApprove={onApprove}
                    />
                    {/* Full-screen spinner overlay */}
                    {loading && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-gray-800" />
                        </div>
                    )}
                </div>
            </PayPalScriptProvider>
        </div>
    );
};

export default PaypalComponent;
