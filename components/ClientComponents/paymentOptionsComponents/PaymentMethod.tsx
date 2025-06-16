'use client';
import { useEffect, useState } from 'react';
// import GPayButton from "./GooglePayButton";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { PaymentMethod } from '@/lib/types/payment_method_type';
import { Button, CircularProgress } from '@mui/material';
import PaypalComponent from '../PaypalComponent';
import { convertToSubcurrency } from '@/utils/convertToSubCurrency';
import StripeComponent from '../StripeComponent';
import GooglePayButton from './GooglePayButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomerOrder } from '@/lib/types/customer_order_type';
interface PaymentMethodProps {
  userData: CustomerOrder;
}

export default function PaymentMethod({ userData }: PaymentMethodProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { payment_type } = useSelector((state: RootState) => state.payment);
  const { cartAmount, finalCartAmount } = useSelector((state: RootState) => state.coupon);
  const searchParams = useSearchParams(); // URLSearchParams
  const basketParam = searchParams.get('basket') || '';

  const serviceFee = finalCartAmount ? (Number(finalCartAmount) * 2.5) / 100 : 0;
  const cappedServiceFee = serviceFee < 0.99 ? serviceFee : 0.99;

  const amountToPay =
    Number(finalCartAmount ?? 0) +
    Number(userData?.customerDetails?.deliveryFee ?? 0) +
    cappedServiceFee;
  const orderPrice = convertToSubcurrency(Number(amountToPay));
  useEffect(() => {
    if (payment_type) {
      setSelectedMethod(payment_type);
      setLoading(false);
    }
  }, [payment_type]);

  if (loading) return null;

  const handleCashPayment = async () => {
    setSubmitting(true);
    const payRes = await fetch('/api/v1/create-cash-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ basketId: basketParam }),
    });

    const payData = await payRes.json();
    if (payData.orderId) {
      setSubmitting(false);
      router.push(
        `/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${payData.orderId}`
      );
      return;
    }
  };

  return (
    <>
      {selectedMethod === 'google' && (
        <GooglePayButton
          cartAmount={cartAmount}
          finalCartAmount={finalCartAmount}
          amount={orderPrice}
        />
      )}
      {selectedMethod === 'paypal' && (
        <PaypalComponent
          cartAmount={cartAmount}
          finalCartAmount={finalCartAmount}
          amount={orderPrice}
        />
      )}
      {selectedMethod === 'credit' && <StripeComponent amount={orderPrice} />}
      {selectedMethod === 'cash' && (
        <Button
          variant="contained"
          onClick={handleCashPayment}
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
          {submitting ? <CircularProgress size={24} /> : 'Place Order'}
        </Button>
      )}
    </>
  );
}
