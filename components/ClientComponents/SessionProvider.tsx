'use client';

import { OrderType } from '@/lib/types/order_type';
import { setOrderType } from '@/store/slices/orderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const SessionProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const createSession = async () => {
      const storedTid = localStorage.getItem('tid');
      const storedSsid = localStorage.getItem('ssid');
      const orderType = sessionStorage.getItem('orderType');
      dispatch(setOrderType(orderType as OrderType));

      try {
        const response = await fetch('/api/v1', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ ssid: storedSsid }),
        });

        if (response.ok) {
          const data = await response.json();
          const { tid, deviceId } = data.data;

          // 🔁 Always update if mismatch OR not set
          if (!storedTid || storedTid !== tid) {
            localStorage.setItem('tid', tid);
          }
          if (!storedSsid || storedSsid !== deviceId) {
            localStorage.setItem('ssid', deviceId);
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
