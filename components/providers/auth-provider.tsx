'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useBloomStore } from '@/lib/store';

const AUTH_ROUTES = ['/login', '/signup', '/onboarding'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout, isAuthenticated } = useBloomStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check existing session on mount (handles OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email!,
          name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? u.email!.split('@')[0],
          dueDate: u.user_metadata?.due_date ?? '',
          pregnancyNumber: u.user_metadata?.pregnancy_number ?? 1,
          partnerMode: u.user_metadata?.partner_mode ?? false,
          createdAt: u.created_at,
        });
        // New user with no due date → onboarding
        if (!u.user_metadata?.due_date && pathname === '/dashboard') {
          router.replace('/onboarding');
        }
      } else {
        logout();
        if (!AUTH_ROUTES.includes(pathname)) {
          router.replace('/login');
        }
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email!,
          name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? u.email!.split('@')[0],
          dueDate: u.user_metadata?.due_date ?? '',
          pregnancyNumber: u.user_metadata?.pregnancy_number ?? 1,
          partnerMode: u.user_metadata?.partner_mode ?? false,
          createdAt: u.created_at,
        });
        if (event === 'SIGNED_IN' && !u.user_metadata?.due_date) {
          router.replace('/onboarding');
        } else if (event === 'SIGNED_IN') {
          router.replace('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
