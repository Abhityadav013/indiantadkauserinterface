'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  condition: boolean; // e.g., !!userAddress
  redirectTo: string; // e.g., '/en/menu-list'
  children: React.ReactNode;
};

export default function ProtectedRoute({ condition, redirectTo, children }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (!condition) {
      router.replace(redirectTo);
    }
  }, [condition, redirectTo, router]);

  if (!condition) return null; // or a loader

  return <>{children}</>;
}
