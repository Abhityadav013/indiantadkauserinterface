'use client';

import { OrderType } from '@/lib/types/order_type';
import { setOrderType } from '@/store/slices/orderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const SessionProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const createSession = async () => {
      const tid = localStorage.getItem('tid');
      const ssid = localStorage.getItem('ssid');
      const orderType = sessionStorage.getItem("orderType")
      dispatch(setOrderType(orderType as OrderType));

      try {
        const response = await fetch('/api/v1', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ ssid }),

        });
        if (response.ok) {
          const data = await response.json();
          if (!tid || !ssid) {
            localStorage.setItem('tid', data.data.tid);
            localStorage.setItem('ssid', data.data.deviceId);
          }
        }
      } catch (err) {
        console.error('Failed to create session:', err);
      }
    };

    createSession();
  }, [dispatch]);

  return null;
};
