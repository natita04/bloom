'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { useBloomStore } from '@/lib/store';
import { getPregnancyWeek, getTrimester, getDaysUntilDue, getProgressPercent } from '@/lib/utils/pregnancy';
import { getWeekData } from '@/lib/data/week-data';
import { getBeContentForWeek } from '@/lib/data/be-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Flame, Brain, Users, ArrowRight, Zap, Moon, Heart } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, streak, logs } = useBloomStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.dueDate) router.replace('/onboarding');
  }, [user]);

  if (!user || !user.dueDate) return null;

  const week = user.dueDate ? getPregnancyWeek(user.dueDate) : 20;
  const trimester = getTrimester(week);
  const daysLeft = user.dueDate ? getDaysUntilDue(user.dueDate) : 0;
  const progress = getProgressPercent(week);
  const weekData = getWeekData(week);
  const beContent = getBeContentForWeek(week);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(l => l.date === today);
  const recentLogs = logs.slice(-7).reverse();

  const avgMood = recentLogs.length
    ? (recentLogs.reduce((s, l) => s + l.moodScore, 0) / recentLogs.length).toFixed(1)
    : '—';
  const avgEnergy = recentLogs.length
    ? (recentLogs.reduce((s, l) => s + l.energyLevel, 0) / recentLogs.length).toFixed(1)
    : '—';

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-zinc-500 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Week {week} <span className="text-zinc-500 font-normal text-xl">of 40</span>
          </h1>
        </div>

        {/* Week Hero */}
        <Card className="bg-zinc-900 border-zinc-800 mb-4 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/20 mb-2">
                    Trimester {trimester}
                  </Badge>
                  <h2 className="text-white font-semibold text-xl">
                    Baby is the size of a {weekData.babySize} {weekData.babySizeEmoji}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    {weekData.babyLength} long · {weekData.babyWeight}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs">Due in</p>
                  <p className="text-white font-bold text-2xl">{daysLeft}</p>
                  <p className="text-zinc-500 text-xs">days</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Week 1</span>
                  <span className="text-rose-400 font-medium">{progress}% complete</span>
                  <span>Week 40</span>
                </div>
                <div className="bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-rose-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Neural fact */}
              <div className="bg-zinc-800/60 rounded-lg p-3 border border-zinc-700/50">
                <p className="text-xs text-zinc-500 mb-0.5 font-medium uppercase tracking-wide">Neural activity</p>
                <p className="text-zinc-300 text-sm">{weekData.neuralFact}</p>
              </div>
            </div>

            {/* Development facts */}
            <div className="border-t border-zinc-800 px-6 py-4">
              <p className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wide">This week</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {weekData.keyDevelopment.map((fact, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5 text-xs">▸</span>
                    <span className="text-zinc-300 text-sm">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-zinc-500">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{streak.currentStreak}</p>
              <p className="text-xs text-zinc-500">days logged</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-zinc-500">Mood avg</span>
              </div>
              <p className="text-2xl font-bold text-white">{avgMood}</p>
              <p className="text-xs text-zinc-500">last 7 days</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-zinc-500">Energy avg</span>
              </div>
              <p className="text-2xl font-bold text-white">{avgEnergy}</p>
              <p className="text-xs text-zinc-500">last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Bias of the Week */}
        <Card className="bg-zinc-900 border-zinc-800 mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                  Bias of the Week
                </CardTitle>
              </div>
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">
                {beContent.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <h3 className="text-white font-bold text-lg mb-1">{beContent.biasName}</h3>
            <p className="text-rose-400 text-sm font-medium mb-3 italic">{beContent.tagline}</p>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">{beContent.description}</p>
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-violet-400 font-medium mb-1 uppercase tracking-wide">The data</p>
              <p className="text-zinc-300 text-sm">{beContent.dataPoint}</p>
            </div>
            <div className="bg-zinc-800/60 rounded-lg p-3">
              <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wide">What to do with it</p>
              <p className="text-zinc-300 text-sm">{beContent.whatToDoWithIt}</p>
            </div>
          </CardContent>
        </Card>

        {/* Social proof */}
        <Card className="bg-zinc-900 border-zinc-800 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wide font-medium">People at week {week}</span>
            </div>
            <p className="text-zinc-200 text-sm leading-relaxed">{weekData.socialProof}</p>
          </CardContent>
        </Card>

        {/* Log today CTA */}
        {!todayLog && (
          <Card className="bg-rose-500/10 border-rose-500/20 mb-4">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Log today</p>
                <p className="text-zinc-400 text-sm">Under 60 seconds. Keeps your streak alive.</p>
              </div>
              <Link href="/log">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white shrink-0">
                  Log now <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {todayLog && (
          <Card className="bg-zinc-900 border-zinc-800 mb-4">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Today logged ✓</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-sm text-zinc-400">Mood <span className="text-white font-medium">{todayLog.moodScore}/10</span></span>
                  <span className="text-sm text-zinc-400">Energy <span className="text-white font-medium">{todayLog.energyLevel}/10</span></span>
                  <span className="text-sm text-zinc-400">Sleep <span className="text-white font-medium">{todayLog.sleepQuality}/10</span></span>
                </div>
              </div>
              <Link href="/insights">
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white shrink-0">
                  View trends
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Mom body changes */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              What's happening to you
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-zinc-500 mb-1 font-medium">Hormones</p>
              <p className="text-zinc-300 text-sm">{weekData.hormoneProfile}</p>
            </div>
            <div className="space-y-1.5">
              {weekData.momChanges.map((change, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 text-xs">▸</span>
                  <span className="text-zinc-300 text-sm">{change}</span>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 rounded-lg p-3 border-l-2 border-rose-500/40">
              <p className="text-zinc-400 text-sm italic">{weekData.behavioralNote}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
