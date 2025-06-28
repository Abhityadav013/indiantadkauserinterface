'use client';

import { useEffect, useState } from 'react';
import ErrorFallback from './ErrorFallback';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason);
      setHasError(true);
    };

    // Handle global JavaScript errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error);
      setHasError(true);
    };

    // Enhanced hydration error detection
    const handleHydrationError = () => {
      // Monitor console.error for hydration messages
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const errorMessage = args.join(' ');
        
        // Check for hydration-related errors
        if (errorMessage.includes('Hydration failed') || 
            errorMessage.includes('Text content does not match') ||
            errorMessage.includes('Hydration') ||
            errorMessage.includes('hydration') ||
            errorMessage.includes('server rendered HTML') ||
            errorMessage.includes('client') ||
            errorMessage.includes('server') ||
            errorMessage.includes('SSR') ||
            errorMessage.includes('CSR')) {
          setError(new Error('Page loading issue detected'));
          setHasError(true);
        }
        
        originalConsoleError.apply(console, args);
      };

      // Monitor console.warn for hydration warnings
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        const warningMessage = args.join(' ');
        
        if (warningMessage.includes('Hydration') || 
            warningMessage.includes('hydration') ||
            warningMessage.includes('server rendered HTML') ||
            warningMessage.includes('Text content does not match')) {
          setError(new Error('Page loading issue detected'));
          setHasError(true);
        }
        
        originalConsoleWarn.apply(console, args);
      };

      return () => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
      };
    };

    // Handle React rendering errors more aggressively
    const handleReactError = () => {
      // Override React's internal error handling
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'error') {
          const wrappedListener = (event: Event) => {
            setError(new Error('Application error detected'));
            setHasError(true);
            if (listener) {
              (listener as EventListener).call(this, event);
            }
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    };

    // Handle network errors
    const handleNetworkError = () => {
      const handleOffline = () => {
        setError(new Error('Network connection lost'));
        setHasError(true);
      };

      const handleOnline = () => {
        // Optionally reset error when connection is restored
        // setHasError(false);
      };

      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);

      return () => {
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      };
    };

    // Handle script loading errors
    const handleScriptError = () => {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'error' && this instanceof HTMLScriptElement) {
          const wrappedListener = (event: Event) => {
            setError(new Error('Resource loading failed'));
            setHasError(true);
            if (listener) {
              (listener as EventListener).call(this, event);
            }
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    };

    // Monitor DOM mutations for hydration issues
    const handleDOMMutations = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.innerHTML?.includes('Hydration failed') || 
                    element.innerHTML?.includes('Text content does not match') ||
                    element.innerHTML?.includes('Hydration') ||
                    element.innerHTML?.includes('hydration') ||
                    element.innerHTML?.includes('server rendered HTML')) {
                  setError(new Error('Page loading issue detected'));
                  setHasError(true);
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    };

    // Monitor for React hydration errors specifically
    const handleReactHydrationError = () => {
      // Override React's internal error logging
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.error = (...args) => {
        const message = args.join(' ');
        if (message.includes('Hydration failed') || 
            message.includes('Text content does not match') ||
            message.includes('server rendered HTML') ||
            message.includes('Expected server HTML to contain')) {
          setError(new Error('Page loading issue detected'));
          setHasError(true);
        }
        originalError.apply(console, args);
      };

      console.warn = (...args) => {
        const message = args.join(' ');
        if (message.includes('Hydration') || 
            message.includes('hydration') ||
            message.includes('server rendered HTML')) {
          setError(new Error('Page loading issue detected'));
          setHasError(true);
        }
        originalWarn.apply(console, args);
      };

      return () => {
        console.error = originalError;
        console.warn = originalWarn;
      };
    };

    // Add all event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);
    
    // Start all error handlers
    const cleanupHydration = handleHydrationError();
    const cleanupNetwork = handleNetworkError();
    const cleanupDOM = handleDOMMutations();
    const cleanupReactHydration = handleReactHydrationError();
    
    // These don't return cleanup functions
    handleReactError();
    handleScriptError();

    // Cleanup function
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
      cleanupHydration();
      cleanupNetwork();
      cleanupDOM();
      cleanupReactHydration();
    };
  }, []);

  // Reset error state
  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  // Show error component for ANY error
  if (hasError) {
    return (
      <ErrorFallback
        error={error || undefined}
        resetError={resetError}
      />
    );
  }

  return <>{children}</>;
};

export default GlobalErrorHandler; 