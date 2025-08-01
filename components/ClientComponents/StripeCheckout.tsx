'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@mui/material';
import { formatPrice } from '@/utils/valueInEuros';
import { useRouter, useSearchParams } from 'next/navigation';
import StripeCheckoutSkeleton from '@/components/Skeletons/StripePageSkeleton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
interface StripeCheckoutProps {
  amount: number;
  clientSecret: string;
}

const StripeCheckout = ({ amount, clientSecret }: StripeCheckoutProps) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const basketParam = searchParams.get('basket') || '';
  const couponApplied = searchParams.get('coupon') || null;
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { cartAmount, finalCartAmount } = useSelector((state: RootState) => state.coupon);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(undefined);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsSubmitting(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required', // For card elements
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Notify server
      const res = await fetch('/api/v1/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          basketId: basketParam,
          ...(couponApplied && {
            discount: {
              code: couponApplied,
              amount: Number((cartAmount - finalCartAmount).toFixed(2)),
            },
          }),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.removeItem('checkout_client_secret');
        router.push(
          `/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${data.orderId}`
        );
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Payment verification failed.');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
      <div className="relative min-h-[90px] border p-4 rounded-md bg-white">
        {/* Skeleton Layer */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isPaymentElementReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <StripeCheckoutSkeleton />
        </div>

        {/* PaymentElement Layer */}
        <div
          className={`transition-opacity duration-500 ease-in-out ${isPaymentElementReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <PaymentElement onReady={() => setIsPaymentElementReady(true)} />
        </div>
        {isPaymentElementReady && (
          <Button
            className={`transition-opacity duration-500 ease-in-out ${!isPaymentElementReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !stripe || !elements}
            fullWidth
            sx={{
              height: '48px',
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
              mt: 2,
              backgroundColor: '#f36805',
              '&:hover': { backgroundColor: '#f36805' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isSubmitting ? (
              <span className="dot-loader">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            ) : (
              `Pay ${formatPrice(amount / 100)}`
            )}

            <style jsx>{`
              .dot-loader {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
              }

              .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 2px 6px rgba(255, 255, 255, 0.6);
                animation: jump 1s infinite ease-in-out;
              }

              .dot:nth-child(1) {
                animation-delay: 0s;
              }
              .dot:nth-child(2) {
                animation-delay: 0.2s;
              }
              .dot:nth-child(3) {
                animation-delay: 0.4s;
              }

              @keyframes jump {
                0%,
                80%,
                100% {
                  transform: scale(1) translateY(0);
                  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.5);
                }
                40% {
                  transform: scale(1.5) translateY(-4px);
                  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.8);
                }
              }
            `}</style>
          </Button>
        )}
      </div>

      {/* Show error only after element is ready */}
      {isPaymentElementReady && errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      {/* Show Pay button only after PaymentElement is ready */}
    </form>
  );
};

export default StripeCheckout;
