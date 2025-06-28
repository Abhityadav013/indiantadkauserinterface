'use client';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { OrderType } from '@/lib/types/order_type';
import { useDispatch } from 'react-redux';
import { setOrderType } from '@/store/slices/orderSlice';
import { Box, Button, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useIsClient } from '@/hooks/useIsClient';

interface BasketToggleProps {
  orderType: OrderType;
}

export default function BasketToggle({ orderType: initialOrderType }: BasketToggleProps) {
  const hasMounted = useHasMounted();
  const isClient = useIsClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderTypeParam = searchParams.get('orderType') as OrderType | null;

  const effectiveOrderType: OrderType = useMemo(() => {
    return orderTypeParam || initialOrderType;
  }, [orderTypeParam, initialOrderType]);

 

  useEffect(() => {
    if (!isClient) return;
    
    if (!orderTypeParam) {
      // No param in URL — fallback to prop & update URL + Redux
      const newParams = new URLSearchParams(window.location.search);
      newParams.set('orderType', initialOrderType);
      router.replace(`/menu-list?${newParams.toString()}`, { scroll: false });
      dispatch(setOrderType(initialOrderType));
    } else {
      // Sync Redux with param from URL
      dispatch(setOrderType(orderTypeParam));
    }
  }, [orderTypeParam, initialOrderType, router, dispatch, isClient]);

  const handleBasketType = (value: OrderType) => {
    if (!isClient) return;
    
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('orderType', value);
    dispatch(setOrderType(value));
    router.replace(`/menu-list?${newParams.toString()}`, { scroll: false });
  };
  if (!hasMounted) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        bgcolor: 'grey.100',
        p: 0.5,
        borderRadius: '999px',
        width: 'fit-content',
        boxShadow: 1,
      }}
    >
      <Button
        onClick={() => handleBasketType(OrderType.DELIVERY)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 0.5,
          borderRadius: '999px',
          bgcolor: effectiveOrderType === OrderType.DELIVERY ? 'white' : 'transparent',
          color: effectiveOrderType === OrderType.DELIVERY ? '#f97316' : 'grey.600',
          fontWeight: effectiveOrderType === OrderType.DELIVERY ? 600 : 400,
          boxShadow: effectiveOrderType === OrderType.DELIVERY ? 1 : 'none',
          textTransform: 'none',
          minWidth: 'auto',
        }}
      >
        <DeliveryDiningIcon fontSize="small" />
        <Typography variant="body2">Delivery</Typography>
      </Button>

      <Button
        onClick={() => handleBasketType(OrderType.PICKUP)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 0.5,
          borderRadius: '999px',
          bgcolor: effectiveOrderType === OrderType.PICKUP ? 'white' : 'transparent',
          color: effectiveOrderType === OrderType.PICKUP ? '#f97316' : 'grey.600',
          fontWeight: effectiveOrderType === OrderType.PICKUP ? 600 : 400,
          boxShadow: effectiveOrderType === OrderType.PICKUP ? 1 : 'none',
          textTransform: 'none',
          minWidth: 'auto',
        }}
      >
        <StorefrontIcon fontSize="small" />
        <Typography variant="body2">Collection</Typography>
      </Button>
    </Box>
  );
}
