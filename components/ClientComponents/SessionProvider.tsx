'use client';

import { useEffect } from 'react';

export const SessionProvider = () => {
  useEffect(() => {
    const createSession = async () => {
      const tid = localStorage.getItem('tid');
      const ssid = localStorage.getItem('ssid');
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
  }, []);

  return null;
};
