'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useBloomStore } from '@/lib/store';
import { getPregnancyWeek } from '@/lib/utils/pregnancy';
import { upsertLog, upsertStreak } from '@/lib/db';
import { getBeContentForWeek } from '@/lib/data/be-content';
import { getReflectionPrompt } from '@/lib/utils/be-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Check, AlertTriangle } from 'lucide-react';
import type { DailyLog, Symptom } from '@/lib/types';

const MOODS: { emoji: string; label: string; score: number }[] = [
  { emoji: '😔', label: 'Low', score: 2 },
  { emoji: '😕', label: 'Rough', score: 4 },
  { emoji: '😐', label: 'Okay', score: 6 },
  { emoji: '🙂', label: 'Good', score: 7 },
  { emoji: '😊', label: 'Great', score: 9 },
  { emoji: '😄', label: 'Amazing', score: 10 },
];

const SYMPTOMS: Symptom[] = [
  'nausea', 'fatigue', 'back pain', 'heartburn', 'headache',
  'swelling', 'insomnia', 'mood swings', 'cravings', 'anxiety',
  'round ligament pain', 'shortness of breath',
];

export default function LogPage() {
  const { user, addLog, getLogForDate } = useBloomStore();
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const existingLog = getLogForDate(today);

  const [selectedMood, setSelectedMood] = useState<number>(existingLog?.moodScore ?? 7);
  const [energy, setEnergy] = useState<number>(existingLog?.energyLevel ?? 6);
  const [sleep, setSleep] = useState<number>(existingLog?.sleepQuality ?? 7);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>(
    (existingLog?.symptoms as Symptom[]) ?? []
  );
  const [decisions, setDecisions] = useState<number>(existingLog?.decisions ?? 2);
  const [notes, setNotes] = useState<string>(existingLog?.notes ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');
  const [savedLog, setSavedLog] = useState<DailyLog | null>(null);

  if (!user) return null;
  const week = getPregnancyWeek(user.dueDate);
  const beContent = getBeContentForWeek(week);
  const reflectionPrompt = getReflectionPrompt(beContent);

  const moodEntry = MOODS.find(m => m.score === selectedMood) ?? MOODS[2];

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    const log: DailyLog = {
      id: `log-${today}`,
      userId: user.id,
      date: today,
      moodScore: selectedMood,
      energyLevel: energy,
      sleepQuality: sleep,
      symptoms: selectedSymptoms,
      decisions,
      notes,
      pregnancyWeek: week,
    };
    addLog(log);
    setSavedLog(log);
    const newStreak = useBloomStore.getState().streak;
    await Promise.all([upsertLog(log), upsertStreak(user.id, newStreak)]);
    setSubmitted(true);
  };

  const handleSaveReflection = async () => {
    if (!savedLog || !reflection.trim()) {
      router.push('/dashboard');
      return;
    }
    const updatedLog: DailyLog = {
      ...savedLog,
      notes: savedLog.notes
        ? `${savedLog.notes}\n\nReflection: ${reflection.trim()}`
        : `Reflection: ${reflection.trim()}`,
    };
    addLog(updatedLog);
    await upsertLog(updatedLog);
    router.push('/dashboard');
  };

  if (submitted) {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-rose-400" />
            </div>
            <h2 className="text-gray-900 text-xl font-bold mb-1">Logged.</h2>
            <p className="text-gray-500 text-sm">Streak kept alive.</p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">
                  {beContent.biasName}
                </Badge>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-3">{reflectionPrompt}</p>
              <Textarea
                placeholder="Optional — no wrong answers…"
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none focus:border-rose-500/50 focus:ring-rose-500/20 mb-4"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push('/dashboard')}
                >
                  Skip
                </Button>
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={handleSaveReflection}
                  disabled={!reflection.trim()}
                >
                  Save to journal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-400 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Daily Log</h1>
          <p className="text-gray-500 text-sm mt-1">Under 60 seconds. No wrong answers.</p>
        </div>

        {existingLog && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-amber-300 text-sm">You already logged today. This will update your entry.</p>
          </div>
        )}

        {/* Mood */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              How are you feeling?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-6 gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.score}
                  onClick={() => setSelectedMood(mood.score)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedMood === mood.score
                      ? 'bg-rose-500/20 ring-1 ring-rose-500/50'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-gray-500">{mood.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Energy & Sleep */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardContent className="p-5 space-y-5">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-600 font-medium">Energy level</span>
                <span className="text-sm text-gray-900 font-bold">{energy}/10</span>
              </div>
              <Slider
                value={[energy]}
                onValueChange={(v) => setEnergy(v[0])}
                min={1} max={10} step={1}
                className="[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-amber-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">Depleted</span>
                <span className="text-xs text-gray-400">Energized</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-600 font-medium">Sleep quality</span>
                <span className="text-sm text-gray-900 font-bold">{sleep}/10</span>
              </div>
              <Slider
                value={[sleep]}
                onValueChange={(v) => setSleep(v[0])}
                min={1} max={10} step={1}
                className="[&_[role=slider]]:bg-violet-400 [&_[role=slider]]:border-violet-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">Terrible</span>
                <span className="text-xs text-gray-400">Restful</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Any symptoms today? <span className="text-gray-400 normal-case font-normal">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Decision fatigue tracker */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Decisions today
              </CardTitle>
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">
                Decision fatigue tracker
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-400 text-xs mb-3">How many significant decisions did you make or face today?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((n) => (
                <button
                  key={n}
                  onClick={() => setDecisions(n === '5+' ? 6 : Number(n))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    (n === '5+' ? decisions >= 5 : decisions === Number(n))
                      ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                      : 'border-gray-300 text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {decisions >= 4 && (
              <p className="text-xs text-amber-400/80 mt-3 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
                High decision load today. Your willpower is a finite resource — delegate or defer anything non-critical this evening.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Notes <span className="text-gray-400 normal-case font-normal">(optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="Anything worth remembering today…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none focus:border-rose-500/50 focus:ring-rose-500/20"
              rows={3}
            />
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3"
          size="lg"
        >
          Save today's log
        </Button>
      </div>
    </AppShell>
  );
}
