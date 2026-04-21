'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useBloomStore } from '@/lib/store';
import { fetchProfile, fetchLogs, fetchUserMilestones, fetchStreak } from '@/lib/db';
import type { User } from '@supabase/supabase-js';

const AUTH_ROUTES = ['/login', '/signup', '/onboarding'];

async function loadUserData(supabaseUser: User, store: ReturnType<typeof useBloomStore.getState>) {
  const profile = await fetchProfile(supabaseUser.id);

  store.setUser({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: profile?.name ?? supabaseUser.email!.split('@')[0],
    dueDate: profile?.due_date ?? '',
    pregnancyNumber: profile?.pregnancy_number ?? 1,
    partnerMode: profile?.partner_mode ?? false,
    createdAt: supabaseUser.created_at,
  });

  const [logs, milestones, streak] = await Promise.all([
    fetchLogs(supabaseUser.id),
    fetchUserMilestones(supabaseUser.id),
    fetchStreak(supabaseUser.id),
  ]);

  store.hydrate(logs, milestones, streak);

  return profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useBloomStore();
  const { logout } = store;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await loadUserData(session.user, useBloomStore.getState());
        if (!profile?.due_date && !AUTH_ROUTES.includes(pathname)) {
          router.replace('/onboarding');
        }
      } else {
        logout();
        if (!AUTH_ROUTES.includes(pathname)) {
          router.replace('/login');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await loadUserData(session.user, useBloomStore.getState());
        if (event === 'SIGNED_IN') {
          if (!profile?.due_date) {
            router.replace('/onboarding');
          } else {
            router.replace('/dashboard');
          }
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
