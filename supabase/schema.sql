-- ============================================================
-- BLOOM — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================


-- ── 1. PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email            TEXT,
  name             TEXT,
  due_date         DATE,
  pregnancy_number INTEGER DEFAULT 1,
  partner_mode     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: select own"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: insert own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: update own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 2. DAILY LOGS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date            DATE NOT NULL,
  mood_score      INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  energy_level    INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  sleep_quality   INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  symptoms        TEXT[]    DEFAULT '{}',
  decisions       INTEGER   DEFAULT 0,
  notes           TEXT      DEFAULT '',
  pregnancy_week  INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs: select own" ON public.daily_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "logs: insert own" ON public.daily_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "logs: update own" ON public.daily_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "logs: delete own" ON public.daily_logs FOR DELETE USING (auth.uid() = user_id);


-- ── 3. USER MILESTONES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_milestones (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  milestone_id  TEXT NOT NULL,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "milestones: select own" ON public.user_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "milestones: insert own" ON public.user_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "milestones: update own" ON public.user_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "milestones: delete own" ON public.user_milestones FOR DELETE USING (auth.uid() = user_id);


-- ── 4. STREAKS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak  INTEGER DEFAULT 0,
  longest_streak  INTEGER DEFAULT 0,
  last_log_date   DATE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "streaks: select own" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streaks: insert own" ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streaks: update own" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);


-- ── 5. TEST USER (email: test@bloom.app / password: 123) ────
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role,
    email, encrypted_password,
    email_confirmed_at, last_sign_in_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated', 'authenticated',
    'test@bloom.app',
    crypt('123', gen_salt('bf')),
    NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(), NOW(),
    '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    'test@bloom.app',
    'email',
    json_build_object('sub', new_user_id::text, 'email', 'test@bloom.app'),
    NOW(), NOW(), NOW()
  );

  INSERT INTO public.profiles (id, email, name, due_date, pregnancy_number)
  VALUES (new_user_id, 'test@bloom.app', 'Test User', '2026-11-01', 1);

  INSERT INTO public.streaks (user_id) VALUES (new_user_id);
END $$;
