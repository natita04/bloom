'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBloomStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useBloomStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <span className="text-4xl animate-pulse">🌸</span>
    </div>
  );
}
