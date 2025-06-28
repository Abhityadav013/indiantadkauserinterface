'use client';

import { OrderType } from '@/lib/types/order_type';
import { setOrderType } from '@/store/slices/orderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSafeLocalStorage, useSafeSessionStorage } from '@/hooks/useIsClient';

export const SessionProvider = () => {
  const dispatch = useDispatch();
  const localStorage = useSafeLocalStorage();
  const sessionStorage = useSafeSessionStorage();

  useEffect(() => {
    const storedTid = localStorage.getItem('tid');
    const storedSsid = localStorage.getItem('ssid');
    const orderType = sessionStorage.getItem('orderType');

    // if (!storedTid || storedTid === 'undefined' || !storedSsid || storedSsid === 'undefined') {
    //   console.log('storedTid::::::', storedTid)
    //   console.log('storedSsid::::::', storedSsid)
    //   console.warn('Missing session info, skipping session fetch');
    //   return;
    // }

    dispatch(setOrderType(orderType as OrderType));

    const createSession = async () => {
      try {
        const response = await fetch('/api/v1', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ ssid: storedSsid, tid: storedTid }),
        });

        if (response.ok) {
          const data = await response.json();
          const { tid, deviceId } = data.data;

          if (!storedTid || storedTid !== tid) localStorage.setItem('tid', tid);
          if (!storedSsid || storedSsid !== deviceId) localStorage.setItem('ssid', deviceId);
        }
      } catch (err) {
        console.error('Failed to create session:', err);
      }
    };

    createSession();
  }, [dispatch, localStorage, sessionStorage]);


  return null;
};
