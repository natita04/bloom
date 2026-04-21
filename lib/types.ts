export interface User {
  id: string;
  email: string;
  name: string;
  dueDate: string; // ISO date string
  pregnancyNumber: number; // 1st, 2nd, 3rd pregnancy
  partnerMode: boolean;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  moodScore: number; // 1-10
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  symptoms: string[];
  decisions: number; // number of decisions logged that day
  notes: string;
  pregnancyWeek: number;
}

export interface Milestone {
  id: string;
  week: number;
  title: string;
  description: string;
  category: 'medical' | 'personal' | 'preparation' | 'emotional';
  isCustom: boolean;
}

export interface UserMilestone {
  milestoneId: string;
  completedAt: string | null;
}

export interface BeContent {
  week: number;
  trimester: 1 | 2 | 3;
  biasName: string;
  tagline: string;
  description: string;
  dataPoint: string;
  whatToDoWithIt: string;
  category: string;
}

export interface WeekData {
  week: number;
  trimester: 1 | 2 | 3;
  babySize: string;
  babySizeEmoji: string;
  babyWeight: string;
  babyLength: string;
  keyDevelopment: string[];
  neuralFact: string;
  momChanges: string[];
  hormoneProfile: string;
  behavioralNote: string;
  socialProof: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}

export type Symptom =
  | 'nausea'
  | 'fatigue'
  | 'back pain'
  | 'heartburn'
  | 'headache'
  | 'swelling'
  | 'insomnia'
  | 'mood swings'
  | 'cravings'
  | 'anxiety'
  | 'round ligament pain'
  | 'shortness of breath';

export type MoodEmoji = '😔' | '😕' | '😐' | '🙂' | '😊' | '😄';

export interface InsightPattern {
  label: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface BiasReference {
  id: string;
  name: string;
  category: string;
  plainDefinition: string;
  pregnancyExample: string;
  dataReference: string;
  whatToDoWithIt: string;
  trimesterRelevance: (1 | 2 | 3)[];
}
