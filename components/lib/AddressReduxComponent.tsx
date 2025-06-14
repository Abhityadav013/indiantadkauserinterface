'use client';

// import { useRouter, usePathname } from 'next/navigation';
// import { useEffect } from 'react';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import { useUpdateCartMutation } from '@/store/api/cartApi';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AddressReduxComponent = () => {
  const searchParams = useSearchParams(); // URLSearchParams
  const orderIdParam = searchParams.get('orderId') || '';
  // const { items, clearCart } = useCart()
    const [updateCart] = useUpdateCartMutation();
  useAddressDetails();

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
