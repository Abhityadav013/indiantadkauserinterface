'use client';

import { OrderType } from '@/lib/types/order_type';
import { setOrderType } from '@/store/slices/orderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSafeLocalStorage, useSafeSessionStorage } from '@/hooks/useIsClient';
import { v4 as uuidv4 } from 'uuid';
import { useHasMounted } from '@/hooks/useHasMounted';

export const SessionProvider = () => {
  const dispatch = useDispatch();
  const localStorage = useSafeLocalStorage();
  const sessionStorage = useSafeSessionStorage();
  const hasMounted = useHasMounted();
  useEffect(() => {
    if (!hasMounted) return; // Only run on client after mount

    let storedTid = localStorage.getItem('tid');
    let storedSsid = localStorage.getItem('ssid');
    const orderType = sessionStorage.getItem('orderType');

    // Generate if missing
    if (!storedTid || storedTid === 'undefined') {
      storedTid = uuidv4();
      localStorage.setItem('tid', storedTid);
    }
    if (!storedSsid || storedSsid === 'undefined') {
      storedSsid = uuidv4();
      localStorage.setItem('ssid', storedSsid);
    }

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
