'use client'

import { convertToSubcurrency } from '@/utils/convertToSubCurrency';
import { useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import { useCallback } from 'react';

interface PayPalButtonProps {
  amount: number;
}

export default function PayPalButton({ amount }: PayPalButtonProps) {
  const stripe = useStripe();
  const orderPrice = convertToSubcurrency(amount)
  const handlePayWithPayPal = useCallback(async () => {
    if (!stripe) return;

    try {
      const res = await fetch('/api/v1/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodType: 'paypal',
          orderPrice,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await res.json();
      console.log('res::::::', clientSecret)
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-complete`,
        },
      });

      if (error) {
        console.error('Stripe PayPal payment error:', error);
        alert(error.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error in PayPal payment:', err);
      alert(err.message || 'An error occurred during payment.');
    }
  }, [stripe, orderPrice]);

  return (
    <button
      onClick={handlePayWithPayPal}
      style={{
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#ffc439',
        border: 'none',
        borderRadius: '0px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      aria-label="Pay with PayPal"
    >
      <Image
        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
        alt="PayPal"
        width={24}
        height={24}
      />
      Pay with PayPal
    </button>
  );
}

