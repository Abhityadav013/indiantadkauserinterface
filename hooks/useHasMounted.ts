// hooks/useHasMounted.ts
import { useEffect, useState } from 'react';

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Use a small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return hasMounted;
}
