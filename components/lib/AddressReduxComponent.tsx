'use client';

import { useAddressDetails } from '@/hooks/useAddressDetails';
import { useGetAvailableCouponsQuery } from '@/store/api/availableCouponsApi';
import { useUpdateCartMutation } from '@/store/api/cartApi';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AddressReduxComponent = () => {
  const searchParams = useSearchParams(); // URLSearchParams
  const orderIdParam = searchParams.get('orderId') || '';
  const [updateCart] = useUpdateCartMutation();
  useAddressDetails();
  useGetAvailableCouponsQuery();
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
