'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useBloomStore } from '@/lib/store';
import { getPregnancyWeek, getTrimester } from '@/lib/utils/pregnancy';
import { biasReferenceLibrary } from '@/lib/data/be-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ChevronDown, ChevronUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BiasReference } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  'Risk Perception': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'Decision Making': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Social': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  'Time & Scarcity': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

function BiasCard({ bias, defaultOpen = false }: { bias: BiasReference; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const colorClass = CATEGORY_COLORS[bias.category] ?? 'text-gray-500 bg-gray-100 border-gray-200';

  return (
    <Card className="bg-white border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn('text-xs border', colorClass)}>
                  {bias.category}
                </Badge>
              </div>
              <CardTitle className="text-gray-900 text-base">{bias.name}</CardTitle>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{bias.plainDefinition}</p>
            </div>
            <div className="shrink-0 mt-0.5">
              {open ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </CardHeader>
      </button>

      {open && (
        <CardContent className="pt-0 pb-4 space-y-3 border-t border-gray-200">
          <div className="pt-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">In pregnancy</p>
            <p className="text-gray-600 text-sm leading-relaxed">{bias.pregnancyExample}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">The research</p>
            <p className="text-gray-500 text-xs italic">{bias.dataReference}</p>
          </div>
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-3">
            <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mb-1">What to do with it</p>
            <p className="text-gray-600 text-sm">{bias.whatToDoWithIt}</p>
          </div>
          <div className="flex gap-1 flex-wrap">
            {bias.trimesterRelevance.map(t => (
              <Badge key={t} className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Trimester {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function DrivesPage() {
  const { user, logs } = useBloomStore();
  if (!user) return null;
  const week = getPregnancyWeek(user.dueDate);
  const trimester = getTrimester(week);

  // Compute personal patterns
  const last14 = logs.slice(-14);
  const highDecisionDays = last14.filter(l => l.decisions >= 4);
  const avgMoodHighDecision = highDecisionDays.length
    ? highDecisionDays.reduce((s, l) => s + l.moodScore, 0) / highDecisionDays.length
    : null;
  const avgMoodOverall = last14.length
    ? last14.reduce((s, l) => s + l.moodScore, 0) / last14.length
    : null;

  const anxietyDays = last14.filter(l => l.symptoms.includes('anxiety')).length;
  const avgSleep = last14.length
    ? (last14.reduce((s, l) => s + l.sleepQuality, 0) / last14.length).toFixed(1)
    : null;

  const relevantBiases = biasReferenceLibrary.filter(b =>
    b.trimesterRelevance.includes(trimester)
  );
  const otherBiases = biasReferenceLibrary.filter(b =>
    !b.trimesterRelevance.includes(trimester)
  );

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">What Drives Me</h1>
          <p className="text-gray-500 text-sm mt-1">
            Your psychological profile — updated as you log.
          </p>
        </div>

        {/* Personal patterns */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" /> Your patterns — last 14 days
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {avgMoodHighDecision !== null && avgMoodOverall !== null && highDecisionDays.length >= 2 && (
              <Card className={cn(
                'border',
                avgMoodHighDecision < avgMoodOverall - 0.5
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-white border-gray-200'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm font-medium">Decision fatigue pattern</p>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        On high-decision days, your mood averages{' '}
                        <span className="text-gray-900 font-medium">{avgMoodHighDecision.toFixed(1)}</span> vs{' '}
                        <span className="text-gray-900 font-medium">{avgMoodOverall.toFixed(1)}</span> overall.
                        {avgMoodHighDecision < avgMoodOverall - 0.5
                          ? ' This is textbook decision fatigue.'
                          : ' You\'re holding up well under load.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {anxietyDays >= 3 && (
              <Card className="bg-violet-500/5 border-violet-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm font-medium">Anxiety frequency</p>
                      <p className="text-gray-500 text-sm mt-1">
                        You logged anxiety on{' '}
                        <span className="text-gray-900 font-medium">{anxietyDays} of the last 14 days</span>.
                        {' '}In T{trimester}, elevated cortisol makes this physiologically expected — not a sign something is wrong.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {avgSleep && Number(avgSleep) < 6 && (
              <Card className="bg-rose-500/5 border-rose-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm font-medium">Sleep deficit</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Your average sleep quality is{' '}
                        <span className="text-gray-900 font-medium">{avgSleep}/10</span> — below typical recovery threshold.
                        Poor sleep amplifies loss aversion and negativity bias significantly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {last14.length < 5 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-400 text-sm">
                    Log for at least 5 days to see your personal patterns here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Trimester-relevant biases */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Biases active in Trimester {trimester}
            </h2>
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs">
              T{trimester} — Week {week}
            </Badge>
          </div>
          <div className="space-y-2">
            {relevantBiases.map((bias, i) => (
              <BiasCard key={bias.id} bias={bias} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* Other biases */}
        {otherBiases.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Full bias reference library
            </h2>
            <div className="space-y-2">
              {otherBiases.map(bias => (
                <BiasCard key={bias.id} bias={bias} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
