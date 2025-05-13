'use client';
import {  useState } from 'react';
import { CreateOrderRequest, OrderSuccessSummary } from '@/lib/types/order_summary';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { ApiError } from '@/utils/ApiResponse';

export function useOrderDetails() {
  const [orderSummary, setOrderSummary] = useState<OrderSuccessSummary>();
  const [createOrder] = useCreateOrderMutation();

  const handleOrderCreation = async (payload: CreateOrderRequest) => {
    try {
      const orderCreatedResponse = await createOrder(payload).unwrap();
      console.log('orderCreatedResponse::::::',orderCreatedResponse)
      if (orderCreatedResponse.orderId) {
        setOrderSummary(orderCreatedResponse);
        return orderCreatedResponse ?? ({} as OrderSuccessSummary);
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

  return {
    orderSummary,
    handleOrderCreation,
  };
}
