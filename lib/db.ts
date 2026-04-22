import { supabase } from '@/lib/supabase';
import type { DailyLog, StreakData, UserMilestone } from '@/lib/types';

// ── Profile ──────────────────────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, fields: {
  due_date?: string;
  pregnancy_number?: number;
  baby_sex?: 'boy' | 'girl' | 'unknown';
  country?: 'US' | 'UK' | 'IL';
  partner_mode?: boolean;
  name?: string;
}) {
  const { error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId);
  return error;
}

// ── Daily logs ────────────────────────────────────────────────

export async function fetchLogs(userId: string): Promise<DailyLog[]> {
  const { data } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (!data) return [];
  return data.map(row => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    moodScore: row.mood_score,
    energyLevel: row.energy_level,
    sleepQuality: row.sleep_quality,
    symptoms: row.symptoms ?? [],
    decisions: row.decisions,
    notes: row.notes ?? '',
    pregnancyWeek: row.pregnancy_week,
  }));
}

export async function upsertLog(log: DailyLog) {
  const { error } = await supabase.from('daily_logs').upsert({
    user_id: log.userId,
    date: log.date,
    mood_score: log.moodScore,
    energy_level: log.energyLevel,
    sleep_quality: log.sleepQuality,
    symptoms: log.symptoms,
    decisions: log.decisions,
    notes: log.notes,
    pregnancy_week: log.pregnancyWeek,
  }, { onConflict: 'user_id,date' });
  return error;
}

// ── Milestones ────────────────────────────────────────────────

export async function fetchUserMilestones(userId: string): Promise<UserMilestone[]> {
  const { data } = await supabase
    .from('user_milestones')
    .select('*')
    .eq('user_id', userId);

  if (!data) return [];
  return data.map(row => ({
    milestoneId: row.milestone_id,
    completedAt: row.completed_at,
  }));
}

export async function upsertMilestone(userId: string, milestoneId: string, completedAt: string | null) {
  const { error } = await supabase.from('user_milestones').upsert({
    user_id: userId,
    milestone_id: milestoneId,
    completed_at: completedAt,
  }, { onConflict: 'user_id,milestone_id' });
  return error;
}

// ── Streaks ───────────────────────────────────────────────────

export async function fetchStreak(userId: string): Promise<StreakData> {
  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data) return { currentStreak: 0, longestStreak: 0, lastLogDate: null };
  return {
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    lastLogDate: data.last_log_date,
  };
}

export async function upsertStreak(userId: string, streak: StreakData) {
  const { error } = await supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: streak.currentStreak,
    longest_streak: streak.longestStreak,
    last_log_date: streak.lastLogDate,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  return error;
}
