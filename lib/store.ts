'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, DailyLog, UserMilestone, StreakData } from '@/lib/types';
import { defaultMilestones } from '@/lib/data/milestones';

interface BloomState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;

  // Daily logs (mock history)
  logs: DailyLog[];

  // Milestones
  userMilestones: UserMilestone[];

  // Streak
  streak: StreakData;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  addLog: (log: DailyLog) => void;
  toggleMilestone: (milestoneId: string) => void;
  getLogForDate: (date: string) => DailyLog | undefined;
}

const mockUser: User = {
  id: 'mock-user-1',
  email: 'demo@bloom.app',
  name: 'Demo User',
  dueDate: '2026-09-15',
  pregnancyNumber: 1,
  partnerMode: false,
  createdAt: '2026-01-01',
};

function generateMockLogs(): DailyLog[] {
  const logs: DailyLog[] = [];
  const today = new Date();
  for (let i = 60; i >= 1; i--) {
    // Skip a few days to simulate realistic streak gaps
    if (i === 45 || i === 44 || i === 22 || i === 7) continue;
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const week = 20 - Math.floor(i / 7);
    const moodBase = 5 + Math.sin(i * 0.4) * 2;
    const mood = Math.max(2, Math.min(9, Math.round(moodBase + (Math.random() - 0.5) * 2)));
    const energy = Math.max(2, Math.min(9, Math.round(6 + Math.sin(i * 0.3) * 2 + (Math.random() - 0.5))));
    const sleep = Math.max(3, Math.min(9, Math.round(7 - (i < 14 ? 1 : 0) + (Math.random() - 0.5) * 2)));
    const symptomPool = ['fatigue', 'back pain', 'heartburn', 'nausea', 'mood swings', 'cravings', 'anxiety'];
    const numSymptoms = Math.floor(Math.random() * 3);
    const symptoms = symptomPool.sort(() => Math.random() - 0.5).slice(0, numSymptoms);
    logs.push({
      id: `log-${dateStr}`,
      userId: mockUser.id,
      date: dateStr,
      moodScore: mood,
      energyLevel: energy,
      sleepQuality: sleep,
      symptoms,
      decisions: Math.floor(Math.random() * 5) + 1,
      notes: '',
      pregnancyWeek: Math.max(1, week),
    });
  }
  return logs;
}

const mockLogs = generateMockLogs();

const mockUserMilestones: UserMilestone[] = defaultMilestones
  .filter(m => m.week <= 18)
  .slice(0, 8)
  .map(m => ({
    milestoneId: m.id,
    completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

export const useBloomStore = create<BloomState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      logs: [],
      userMilestones: [],
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastLogDate: null,
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

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
          if (existing.completedAt) {
            set({ userMilestones: userMilestones.map(m => m.milestoneId === milestoneId ? { ...m, completedAt: null } : m) });
          } else {
            set({ userMilestones: userMilestones.map(m => m.milestoneId === milestoneId ? { ...m, completedAt: new Date().toISOString() } : m) });
          }
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
        logs: state.logs,
        userMilestones: state.userMilestones,
        streak: state.streak,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
