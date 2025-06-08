/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import GooglePayButton from '@google-pay/button-react';

const GPayButton = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Create PaymentIntent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch('/api/v1/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 1500, // in cents: €15.00
            currency: 'eur',
          }),
        });

        const data = await res.json();

        if (res.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log('✅ Got clientSecret:', data.clientSecret);
        } else {
          throw new Error(data?.error || 'Failed to retrieve client secret.');
        }
      } catch (err: any) {
        console.error('❌ Error creating PaymentIntent:', err.message || err);
        setError('Could not initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!clientSecret) return <div>Loading payment...</div>;

  return (
    <GooglePayButton
      environment="TEST"
      buttonType="pay"
      buttonColor="black"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'stripe',
                'stripe:version': '2020-08-27',
                'stripe:publishableKey':
                  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: 'BCR2DN7TZDVJFLDA', // fallback test ID
          merchantName: 'Indian Tadka',
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: '15.00',
          currencyCode: 'EUR',
        },
        shippingAddressRequired: true,
        callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
      }}
      onLoadPaymentData={async (paymentData) => {
        try {
          console.log('✅ Payment data received', paymentData);

          const tokenData = paymentData.paymentMethodData.tokenizationData.token;
          const token =
            typeof tokenData === 'string' ? JSON.parse(tokenData) : tokenData;

          const res = await fetch('/api/v1/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              clientSecret,
            }),
          });

          const data = await res.json();
          if (res.ok && data.success) {
            console.log('✅ Payment succeeded', data);
            alert('Payment successful!');
          } else {
            console.error('❌ Payment failed', data.error);
            alert('Payment failed. Please try again.');
          }
        } catch (error: any) {
          console.error('❌ Error in payment processing:', error.message || error);
          alert('Something went wrong during payment.');
        }
      }}
      onPaymentAuthorized={(paymentData) => {
        console.log('✅ Payment authorized', paymentData);
        return { transactionState: 'SUCCESS' };
      }}
      onPaymentDataChanged={(paymentData) => {
        console.log('ℹ️ Payment data changed', paymentData);
        return {};
      }}
    />
  );
};

export default GPayButton;
