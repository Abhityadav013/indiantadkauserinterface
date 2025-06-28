import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

export function useSafeMediaQuery(query: string | ((theme: any) => string)) {
  const theme = useTheme();
  const mq = useMediaQuery(query);
  const [isClient, setIsClient] = useState(false);
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMatches(mq);
  }, [mq]);

  // During SSR, return false to prevent hydration mismatch
  // After hydration, return the actual media query result
  return isClient ? matches : false;
}

export function useSafeBreakpoint() {
  const theme = useTheme();
  const isMobile = useSafeMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useSafeMediaQuery(theme.breakpoints.down('lg'));
  const isDesktop = useSafeMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
} 