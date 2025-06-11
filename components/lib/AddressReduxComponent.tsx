'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAddressDetails } from '@/hooks/useAddressDetails';

const AddressReduxComponent = () => {
  useAddressDetails();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract the actual path after the locale prefix
    const cartTotal = sessionStorage.getItem('cartTotal');
    const pathSegments = pathname.split('/');
    const actualPath = '/' + pathSegments.slice(2).join('/'); // skip ["", "de", "checkout"]

    const isCheckoutPath = actualPath.startsWith('/checkout');

    if (isCheckoutPath && (!cartTotal)) {
      // Preserve the locale prefix when redirecting
      const locale = pathSegments[1];
      router.replace(`/${locale}/menu-list`);
    }
  }, [pathname, router]);

  return null;
};

export default AddressReduxComponent;
