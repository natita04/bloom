'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, DailyLog, UserMilestone, StreakData } from '@/lib/types';

interface BloomState {
  user: User | null;
  isAuthenticated: boolean;
  logs: DailyLog[];
  userMilestones: UserMilestone[];
  streak: StreakData;

  setUser: (user: User) => void;
  logout: () => void;
  hydrate: (logs: DailyLog[], milestones: UserMilestone[], streak: StreakData) => void;
  addLog: (log: DailyLog) => void;
  toggleMilestone: (milestoneId: string) => void;
  getLogForDate: (date: string) => DailyLog | undefined;
}

export const useBloomStore = create<BloomState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      logs: [],
      userMilestones: [],
      streak: { currentStreak: 0, longestStreak: 0, lastLogDate: null },

      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        logs: [],
        userMilestones: [],
        streak: { currentStreak: 0, longestStreak: 0, lastLogDate: null },
      }),

      hydrate: (logs, milestones, streak) => set({ logs, userMilestones: milestones, streak }),

      addLog: (log) => {
        const { logs, streak } = get();
        const existing = logs.findIndex(l => l.date === log.date);
        const newLogs = existing >= 0
          ? logs.map((l, i) => i === existing ? log : l)
          : [...logs, log].sort((a, b) => a.date.localeCompare(b.date));
        const today = new Date().toISOString().split('T')[0];
        const newStreak = streak.lastLogDate === today
          ? streak
          : {
              currentStreak: streak.currentStreak + 1,
              longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
              lastLogDate: today,
            };
        set({ logs: newLogs, streak: newStreak });
      },

      toggleMilestone: (milestoneId) => {
        const { userMilestones } = get();
        const existing = userMilestones.find(m => m.milestoneId === milestoneId);
        if (existing) {
          set({
            userMilestones: userMilestones.map(m =>
              m.milestoneId === milestoneId
                ? { ...m, completedAt: m.completedAt ? null : new Date().toISOString() }
                : m
            ),
          });
        } else {
          set({ userMilestones: [...userMilestones, { milestoneId, completedAt: new Date().toISOString() }] });
        }
      },

      getLogForDate: (date) => get().logs.find(l => l.date === date),
    }),
    {
      name: 'bloom-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
