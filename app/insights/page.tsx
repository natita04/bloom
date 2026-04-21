'use client';

import { useMemo } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useBloomStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Brain, Activity } from 'lucide-react';

const SYMPTOM_LIST = [
  'nausea', 'fatigue', 'back pain', 'heartburn', 'headache',
  'swelling', 'insomnia', 'mood swings', 'cravings', 'anxiety',
];

function TrendIcon({ value }: { value: number }) {
  if (value > 0.3) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  if (value < -0.3) return <TrendingDown className="w-4 h-4 text-rose-400" />;
  return <Minus className="w-4 h-4 text-zinc-500" />;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-zinc-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  const { logs } = useBloomStore();

  const last28 = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const log = logs.find(l => l.date === date);
      days.push({
        date,
        label: format(subDays(today, i), 'MMM d'),
        mood: log?.moodScore ?? null,
        energy: log?.energyLevel ?? null,
        sleep: log?.sleepQuality ?? null,
        logged: !!log,
      });
    }
    return days;
  }, [logs]);

  const chartData = last28.filter(d => d.logged);

  // Symptom frequency
  const symptomCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.slice(-28).forEach(log => {
      log.symptoms.forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [logs]);

  // Trend: compare last 7 vs previous 7
  const trends = useMemo(() => {
    const recent = logs.slice(-7);
    const prev = logs.slice(-14, -7);
    const avg = (arr: typeof logs, key: keyof typeof logs[0]) =>
      arr.length ? arr.reduce((s, l) => s + (l[key] as number), 0) / arr.length : 0;
    return {
      mood: avg(recent, 'moodScore') - avg(prev, 'moodScore'),
      energy: avg(recent, 'energyLevel') - avg(prev, 'energyLevel'),
      sleep: avg(recent, 'sleepQuality') - avg(prev, 'sleepQuality'),
      moodCurrent: avg(recent, 'moodScore'),
      energyCurrent: avg(recent, 'energyLevel'),
      sleepCurrent: avg(recent, 'sleepQuality'),
    };
  }, [logs]);

  // Decision fatigue pattern
  const decisionInsight = useMemo(() => {
    const highDecisionLogs = logs.filter(l => l.decisions >= 4);
    const highDecisionMoodAvg = highDecisionLogs.length
      ? highDecisionLogs.reduce((s, l) => s + l.moodScore, 0) / highDecisionLogs.length
      : null;
    const normalMoodAvg = logs.filter(l => l.decisions < 4).reduce((s, l) => s + l.moodScore, 0) / Math.max(1, logs.filter(l => l.decisions < 4).length);
    return { highDecisionMoodAvg, normalMoodAvg, sampleSize: highDecisionLogs.length };
  }, [logs]);

  // Weekly streak heatmap (last 28 days)
  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 4; w++) {
      const week = last28.slice(w * 7, (w + 1) * 7);
      weeks.push(week);
    }
    return weeks;
  }, [last28]);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Insights</h1>
          <p className="text-zinc-400 text-sm mt-1">Your patterns, visualized. Last 28 days.</p>
        </div>

        {/* Trend cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Mood', value: trends.moodCurrent, trend: trends.mood, color: 'text-rose-400' },
            { label: 'Energy', value: trends.energyCurrent, trend: trends.energy, color: 'text-amber-400' },
            { label: 'Sleep', value: trends.sleepCurrent, trend: trends.sleep, color: 'text-violet-400' },
          ].map(({ label, value, trend, color }) => (
            <Card key={label} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500">{label}</span>
                  <TrendIcon value={trend} />
                </div>
                <p className={`text-2xl font-bold ${color}`}>{value.toFixed(1)}</p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)} vs last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mood chart */}
        <Card className="bg-zinc-900 border-zinc-800 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4" /> Mood & Energy — 28 days
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {chartData.length < 3 ? (
              <div className="h-48 flex items-center justify-center text-zinc-600 text-sm">
                Log at least 3 days to see your chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="mood" name="Mood" stroke="#f43f5e" strokeWidth={2} fill="url(#moodGrad)" dot={false} connectNulls />
                  <Area type="monotone" dataKey="energy" name="Energy" stroke="#f59e0b" strokeWidth={2} fill="url(#energyGrad)" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Sleep chart */}
        <Card className="bg-zinc-900 border-zinc-800 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              Sleep quality — 28 days
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {chartData.length < 3 ? (
              <div className="h-32 flex items-center justify-center text-zinc-600 text-sm">
                Not enough data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#a78bfa" strokeWidth={2} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Log heatmap */}
        <Card className="bg-zinc-900 border-zinc-800 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              Logging streak — last 28 days
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex gap-1.5">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={`${day.label}: ${day.logged ? 'logged' : 'not logged'}`}
                      className={`flex-1 h-6 rounded-sm transition-colors ${
                        day.logged ? 'bg-rose-500' : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-zinc-600">
              <div className="w-3 h-3 rounded-sm bg-zinc-800" />
              <span>Not logged</span>
              <div className="w-3 h-3 rounded-sm bg-rose-500 ml-2" />
              <span>Logged</span>
            </div>
          </CardContent>
        </Card>

        {/* Symptom frequency */}
        {symptomCounts.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800 mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                Symptom frequency — last 28 days
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {symptomCounts.map(([symptom, count]) => (
                <div key={symptom} className="flex items-center gap-3">
                  <span className="text-zinc-300 text-sm w-32 shrink-0 capitalize">{symptom}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-rose-500/70 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (count / 28) * 100)}%` }}
                    />
                  </div>
                  <span className="text-zinc-500 text-xs w-12 text-right shrink-0">{count} days</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Decision fatigue insight */}
        {decisionInsight.sampleSize >= 3 && decisionInsight.highDecisionMoodAvg && (
          <Card className="bg-violet-500/5 border-violet-500/20 mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                <CardTitle className="text-sm font-medium text-violet-400 uppercase tracking-wide">
                  Pattern detected
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-zinc-200 text-sm leading-relaxed">
                On days when you logged 4+ decisions, your mood averaged{' '}
                <span className="font-semibold text-white">{decisionInsight.highDecisionMoodAvg.toFixed(1)}/10</span> —
                compared to{' '}
                <span className="font-semibold text-white">{decisionInsight.normalMoodAvg.toFixed(1)}/10</span>{' '}
                on lower-decision days. This is consistent with decision fatigue research.
              </p>
              <div className="mt-3 bg-violet-500/10 rounded-lg p-3">
                <p className="text-xs text-violet-300">
                  Your data supports the theory. Save your best thinking for mornings.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Automated insights */}
        {logs.length >= 7 && (() => {
          const thursdays = logs.filter(l => new Date(l.date).getDay() === 4);
          const avgThursday = thursdays.length
            ? thursdays.reduce((s, l) => s + l.energyLevel, 0) / thursdays.length
            : null;
          const overallAvg = logs.reduce((s, l) => s + l.energyLevel, 0) / logs.length;
          if (avgThursday && avgThursday < overallAvg - 0.8) {
            return (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 shrink-0 mt-0.5">Auto-insight</Badge>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Your energy is consistently lower on Thursdays (avg {avgThursday.toFixed(1)}) vs your weekly average ({overallAvg.toFixed(1)}). Consider protecting Thursday mornings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null;
        })()}
      </div>
    </AppShell>
  );
}
