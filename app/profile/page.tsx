'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useBloomStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPregnancyWeek, formatDueDate, getDaysUntilDue } from '@/lib/utils/pregnancy';
import { updateProfile } from '@/lib/db';
import { cn } from '@/lib/utils';
import { Flame, Download, LogOut, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, streak, logs, logout, setUser } = useBloomStore();
  if (!user) return null;

  const hasDueDate = !!user.dueDate;
  const week = hasDueDate ? getPregnancyWeek(user.dueDate) : 0;
  const daysLeft = hasDueDate ? getDaysUntilDue(user.dueDate) : 0;

  const [babySex, setBabySex] = useState<'boy' | 'girl' | 'unknown'>(user.babySex ?? 'unknown');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveBabySex = async (value: 'boy' | 'girl' | 'unknown') => {
    setBabySex(value);
    setSaving(true);
    setSaved(false);
    await updateProfile(user.id, { baby_sex: value });
    setUser({ ...user, babySex: value });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const csv = [
      'date,week,mood,energy,sleep,symptoms,decisions,notes',
      ...logs.map(l =>
        `${l.date},${l.pregnancyWeek},${l.moodScore},${l.energyLevel},${l.sleepQuality},"${l.symptoms.join('|')}",${l.decisions},"${l.notes}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bloom-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* User info */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500/15 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">{user.email}</p>
                <p className="text-gray-400 text-sm">
                  Pregnancy {user.pregnancyNumber === 1 ? '1st' : user.pregnancyNumber === 2 ? '2nd' : '3rd+'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pregnancy info */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Pregnancy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Current week</span>
              <span className="text-gray-900 font-medium">{hasDueDate ? `Week ${week}` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Due date</span>
              <span className="text-gray-900 font-medium">{hasDueDate ? formatDueDate(user.dueDate) : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Days remaining</span>
              <span className="text-gray-900 font-medium">{hasDueDate ? `${daysLeft} days` : '—'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Baby sex */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Baby
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-500 text-sm mb-3">Baby's sex</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'girl' as const, label: 'Girl', emoji: '💗' },
                { value: 'boy' as const, label: 'Boy', emoji: '💙' },
                { value: 'unknown' as const, label: "Don't know", emoji: '🤍' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSaveBabySex(opt.value)}
                  disabled={saving}
                  className={cn(
                    'py-3 px-2 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1',
                    babySex === opt.value
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  )}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {saved && (
              <p className="text-rose-400 text-xs mt-2 text-center">Saved ✓</p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-white border-gray-200 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Your stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Flame className="w-4 h-4 text-orange-400" />
                Current streak
              </div>
              <span className="text-gray-900 font-medium">{streak.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Longest streak</span>
              <span className="text-gray-900 font-medium">{streak.longestStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Total days logged</span>
              <span className="text-gray-900 font-medium">{logs.length} days</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 justify-start gap-3"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export my data (.csv)
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-200 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 justify-start gap-3"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>

        <p className="text-gray-300 text-xs text-center mt-8">
          Bloom v0.1.0 · Your data is private by default
        </p>
      </div>
    </AppShell>
  );
}
