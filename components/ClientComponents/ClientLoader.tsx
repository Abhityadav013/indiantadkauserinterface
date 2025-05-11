'use client'
import { useEffect, useState } from 'react';

export default function ClientLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // or a skeleton/loader
}
