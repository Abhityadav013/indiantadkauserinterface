'use client';

import { useUpdateCartMutation } from '@/store/api/cartApi';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AddressReduxComponent = () => {
  const searchParams = useSearchParams(); // URLSearchParams
  const orderIdParam = searchParams.get('orderId') || '';
  const [updateCart] = useUpdateCartMutation();

  useEffect(() => {
    const updateCartAsync = async () => {
      if (orderIdParam) {
        await updateCart({ cart: [], isCartEmpty: true });
      }
    };
    updateCartAsync();
  }, [orderIdParam, updateCart])

  return null;
};

export default AddressReduxComponent;
