'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCartDetails';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import { useUpdateCartMutation } from '@/store/api/cartApi';
import Image from 'next/image';
import { OrderType } from '@/lib/types/order_type';
import { ApiError } from '@/utils/ApiResponse';
import { useOrderDetails } from '@/hooks/userOrderDetails';

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const { items } = useCart();
  const { customerOrder } = useAddressDetails();
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const hasRunRef = useRef(false);
  const [updateCart] = useUpdateCartMutation();
  const { orderSummary, handleOrderCreation } = useOrderDetails()
  // Create Order only once
  useEffect(() => {
    if (hasRunRef.current || (Array.isArray(items) && items.length === 0 && !customerOrder)) return;
    hasRunRef.current = true;


    const handleCreateOrder = async () => {
      try {
        const deliveryFee = sessionStorage.getItem('deliveryFee');
        const tipAmount = sessionStorage.getItem('tipAmount');
        const orderCreatedResponse = await handleOrderCreation({
          orderDetails: items,
          orderType: customerOrder?.orderType as OrderType,
          paymentIntentId: paymentIntent,
          ...deliveryFee && { deliveryFee: parseFloat(deliveryFee) },
          ...tipAmount && { tipAmount: parseFloat(tipAmount) }
        });

        if (!orderCreatedResponse) {
          throw new Error('Order creation failed: No response received.');
        }
        if (orderCreatedResponse.orderId) {
          updateCart({ cart: [], isCartEmpty: true });
          setIsOrderSuccess(true);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          console.error('API Error:', error.message);
          // Optionally show error.message or error.validationErrors in UI
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };

    // hasRunRef.current = true;
    handleCreateOrder();
  }, [items, customerOrder, paymentIntent, updateCart, handleOrderCreation]);

  useEffect(() => {
    if (!isOrderSuccess) return;
    setCountdown(5);
  }, [isOrderSuccess]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0 && orderSummary?.displayId) {
      router.push(`/order-confirmation?orderId=${orderSummary?.displayId}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, orderSummary]);

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: '#f4f6f8',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          p: 4,
          boxShadow: 3,
          borderRadius: 4,
          textAlign: 'center',
          backgroundColor: '#f4f6f8',
        }}
      >
        <Image
          src='https://testing.indiantadka.eu/assets/success-tick-new.gif' // Replace with your own green tick path in public/images
          alt="Success"
          width={100}
          height={100}
          style={{ margin: '0 auto' }}
        />

        <Typography variant="h4" sx={{ mt: 3, color: 'green' }}>
          Payment Successful!
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
          Your order is confirmed.
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Thank you for choosing Indian Tadka. Your delicious food is being prepared with love! ❤️
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2, bgcolor: '#FF6347' }}
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>

        {countdown !== null && (
          <Typography variant="caption" sx={{ mt: 2, color: 'gray' }}>
            You’ll be redirected in <strong>{countdown}</strong> second{countdown !== 1 && 's'}...
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default PaymentSuccess;
