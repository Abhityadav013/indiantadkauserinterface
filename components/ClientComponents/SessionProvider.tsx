'use client';

import { useEffect } from 'react';

export const SessionProvider = () => {
  useEffect(() => {
    const createSession = async () => {
      const tid = localStorage.getItem('tid');
      const ssid = localStorage.getItem('ssid');

      if (!tid || !ssid) {
        try {
          const response = await fetch('/api/v1', {
            method: 'POST',
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            console.log('data::::::::',data)
            localStorage.setItem('tid', data.data.tid);
            localStorage.setItem('ssid', data.data.deviceId);
          }
        } catch (err) {
          console.error('Failed to create session:', err);
        }
      }
    };

    createSession();
  }, []);

  return null;
};
