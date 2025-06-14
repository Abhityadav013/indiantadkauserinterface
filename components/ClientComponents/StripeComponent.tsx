'use client';
import React from 'react';
import { Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

interface StripeComponentProps {
  amount: number;
}

const StripeComponent: React.FC<StripeComponentProps> = ({ amount }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get('basket') || '';
  const fetchPaymentIntent = async () => {
    const res = await fetch('/api/v1/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: "eur" }),
    });

    const data = await res.json();

    if (res.ok && data.clientSecret) {
      const paymentIntentId = data.clientSecret.split('_secret_')[0]; // ✅ extract directly
      sessionStorage.setItem('checkout_client_secret', data.clientSecret);
      router.push(`/payment/${paymentIntentId}?basket=${qParam}`); // ✅ now works correctly
    }
  };

  const handleCardPayment = () => {
    fetchPaymentIntent();
  };

  return (
    <Button
      variant="contained"
      onClick={handleCardPayment}
      sx={{
        width: '100%',
        backgroundColor: '#f36805',
        color: 'white',
        padding: '6px 12px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '50px',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#f36805',
        },
      }}
    >
      Pay & Place Order
    </Button>
  );
};

export default StripeComponent;
