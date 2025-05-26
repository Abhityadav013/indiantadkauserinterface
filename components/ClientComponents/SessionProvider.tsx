'use client';

import { OrderType } from '@/lib/types/order_type';
import { setOrderType } from '@/store/slices/orderSlice';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export const SessionProvider = () => {
  const dispatch = useDispatch();
  const clearedOnce = useRef(false);

  useEffect(() => {
    // Clear cookies function (client-side)
    const clearAllCookies = () => {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
        // You can add domain if needed, e.g.
        // document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=yourdomain.com;SameSite=Lax`;
      }
    };

    const createSession = async () => {
      // Run your existing session creation logic
      const tid = localStorage.getItem('tid');
      const ssid = localStorage.getItem('ssid');
      const orderType = sessionStorage.getItem("orderType");
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

    if (!clearedOnce.current) {
      // Clear all storages & cookies only once
      localStorage.clear();
      sessionStorage.clear();
      clearAllCookies();
      clearedOnce.current = true;
    }

    createSession();
  }, [dispatch]);

  return null;
};
