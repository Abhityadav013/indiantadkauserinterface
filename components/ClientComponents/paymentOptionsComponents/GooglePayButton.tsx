/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeCoupon } from '@/store/slices/discountCoupon';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
interface GPayButtonProps {
  cartAmount: number;
  finalCartAmount: number;
  amount: number;
}

export default function GooglePayButton({ cartAmount, finalCartAmount, amount }: GPayButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basketParam = searchParams.get('basket') || '';
  const couponApplied = searchParams.get('coupon') || null;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const paymentsClientRef = useRef<google.payments.api.PaymentsClient | null>(null);

  const handleGooglePayClick = useCallback(() => {
    if (!paymentsClientRef.current) return;

    const paymentRequest: google.payments.api.PaymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              'stripe:version': '2020-08-27',
              'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
            },
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: (amount / 100).toFixed(2),
        currencyCode: 'EUR',
      },
      merchantInfo: {
        merchantId: 'BCR2DN7TZDVJFLDA',
        merchantName: 'Indian Tadka',
      },
    };

    setLoading(true);

    paymentsClientRef.current
      .loadPaymentData(paymentRequest)
      .then(async (paymentData) => {
        const tokenData = paymentData?.paymentMethodData.tokenizationData.token;
        const token = typeof tokenData === 'string' ? JSON.parse(tokenData) : tokenData;

        const payRes = await fetch('/api/v1/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            return_url: window.location.href,
            currency: 'eur',
            amount, // send amount again, since we didn't pre-create intent
            basketId: basketParam,
            ...(couponApplied && {
              discount: {
                code: couponApplied,
                amount: Number((cartAmount - finalCartAmount).toFixed(2)),
              },
            }),
          }),
        });

        const payData = await payRes.json();
        if (payData.orderId) {
          dispatch(removeCoupon());
          toast.success('Payment successful!'); // also shows for 3s
          router.push(`/checkout?basket=${basketParam}&orderId=${payData.orderId}`);
        } else {
          toast.error('Payment was cancelled or failed.');
        }
      })
      .catch((err: any) => {
        console.error('❌ Google Pay error', err.message || err);
        toast.error('Payment was cancelled or failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [amount, basketParam, cartAmount, finalCartAmount, couponApplied, router, dispatch]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;

    script.onload = () => {
      if (!window.google) return;

      paymentsClientRef.current = new window.google.payments.api.PaymentsClient({
        environment: 'TEST',
      });

      const button = paymentsClientRef.current.createButton({
        buttonColor: 'default',
        buttonType: 'pay',
        onClick: handleGooglePayClick,
      });

      if (btnRef.current) {
        btnRef.current.innerHTML = '';
        btnRef.current.appendChild(button);
      }
    };

    document.head.appendChild(script);
    
    // Capture the ref value to avoid stale closure
    const buttonElement = btnRef.current;
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (buttonElement) {
        buttonElement.innerHTML = '';
      }
    };
  }, [handleGooglePayClick]);

  return (
    <div className="relative inline-block" style={{ width: 'fit-content' }}>
      <div ref={btnRef} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md pointer-events-none">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
        </div>
      )}
    </div>
  );
}
