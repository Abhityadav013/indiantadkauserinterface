'use client';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { OrderType } from '@/lib/types/order_type';
import { useDispatch } from 'react-redux';
import { setOrderType } from '@/store/slices/orderSlice';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

interface BasketToggleProps{
  orderType:OrderType
}
export default function BasketToggle({orderType}:BasketToggleProps) {
  const dispatch = useDispatch();
  const [order_type,setorder_typeOrderType] =useState(orderType ?? OrderType.DELIVERY)
  const handleBasketType = (value: OrderType) => {
    setorder_typeOrderType(value)
    dispatch(setOrderType(value));
    sessionStorage.setItem('orderType', value);
  };

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
        variant="text"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 0.5,
          borderRadius: '999px',
          bgcolor: order_type === OrderType.DELIVERY ? 'white' : 'transparent',
          color: order_type === OrderType.DELIVERY ? '#f97316' : 'grey.600',
          fontWeight: order_type === OrderType.DELIVERY ? 600 : 400,
          boxShadow: order_type === OrderType.DELIVERY ? 1 : 'none',
          textTransform: 'none',
          minWidth: 'auto',
        }}
      >
        <DeliveryDiningIcon fontSize="small" />
        <Typography variant="body2">Delivery</Typography>
      </Button>

      <Button
        onClick={() => handleBasketType(OrderType.PICKUP)}
        variant="text"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 0.5,
          borderRadius: '999px',
          bgcolor: order_type === OrderType.PICKUP ? 'white' : 'transparent',
          color: order_type === OrderType.PICKUP ? '#f97316' : 'grey.600',
          fontWeight: order_type === OrderType.PICKUP ? 600 : 400,
          boxShadow: order_type === OrderType.PICKUP ? 1 : 'none',
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
