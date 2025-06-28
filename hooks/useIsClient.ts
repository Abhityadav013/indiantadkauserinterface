import { useState, useEffect } from 'react';

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function useSafeLocalStorage() {
  const isClient = useIsClient();
  
  return {
    getItem: (key: string): string | null => {
      if (!isClient) return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      if (!isClient) return;
      try {
        localStorage.setItem(key, value);
      } catch {
        // Silently fail if localStorage is not available
      }
    },
    removeItem: (key: string): void => {
      if (!isClient) return;
      try {
        localStorage.removeItem(key);
      } catch {
        // Silently fail if localStorage is not available
      }
    }
  };
}

export function useSafeSessionStorage() {
  const isClient = useIsClient();
  
  return {
    getItem: (key: string): string | null => {
      if (!isClient) return null;
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      if (!isClient) return;
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // Silently fail if sessionStorage is not available
      }
    },
    removeItem: (key: string): void => {
      if (!isClient) return;
      try {
        sessionStorage.removeItem(key);
      } catch {
        // Silently fail if sessionStorage is not available
      }
    }
  };
} 