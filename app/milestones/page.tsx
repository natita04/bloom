'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useBloomStore } from '@/lib/store';
import { upsertMilestone } from '@/lib/db';
import { getPregnancyWeek } from '@/lib/utils/pregnancy';
import { defaultMilestones } from '@/lib/data/milestones';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, Stethoscope, Heart, PackageOpen, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Milestone } from '@/lib/types';

const CATEGORY_META = {
  medical: { label: 'Medical', icon: Stethoscope, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  preparation: { label: 'Preparation', icon: PackageOpen, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  personal: { label: 'Personal', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  emotional: { label: 'Emotional', icon: Smile, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

type FilterType = 'all' | 'upcoming' | 'completed' | Milestone['category'];

export default function MilestonesPage() {
  const { user, userMilestones, toggleMilestone } = useBloomStore();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!user) return null;
  const currentWeek = getPregnancyWeek(user.dueDate);

  const isCompleted = (id: string) =>
    !!userMilestones.find(m => m.milestoneId === id && m.completedAt);

  const weeksUntil = (week: number) => week - currentWeek;

  const filteredMilestones = defaultMilestones
    .filter(m => {
      if (filter === 'completed') return isCompleted(m.id);
      if (filter === 'upcoming') return !isCompleted(m.id) && m.week >= currentWeek;
      if (filter === 'medical' || filter === 'preparation' || filter === 'personal' || filter === 'emotional') {
        return m.category === filter;
      }
      return true;
    })
    .sort((a, b) => {
      // Completed milestones go to bottom
      const aDone = isCompleted(a.id);
      const bDone = isCompleted(b.id);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return a.week - b.week;
    });

  const completedCount = defaultMilestones.filter(m => isCompleted(m.id)).length;
  const totalCount = defaultMilestones.length;
  const upcomingCount = defaultMilestones.filter(m => !isCompleted(m.id) && m.week >= currentWeek && m.week <= currentWeek + 4).length;

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Done' },
    { key: 'medical', label: 'Medical' },
    { key: 'preparation', label: 'Prep' },
    { key: 'personal', label: 'Personal' },
    { key: 'emotional', label: 'Emotional' },
  ];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
          <p className="text-gray-500 text-sm mt-1">Track appointments, prep tasks, and moments.</p>
        </div>

        {/* Progress summary */}
        <Card className="bg-white border-gray-200 mb-5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-900 font-semibold">
                  {completedCount} of {totalCount} complete
                </p>
                <p className="text-gray-400 text-sm">{upcomingCount > 0 ? `${upcomingCount} due in the next 4 weeks` : 'No urgent milestones'}</p>
              </div>
              <div className="text-right">
                <p className="text-rose-400 font-bold text-xl">{Math.round((completedCount / totalCount) * 100)}%</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-400 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-all',
                filter === key
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Milestone list */}
        <div className="space-y-2">
          {filteredMilestones.map((milestone) => {
            const done = isCompleted(milestone.id);
            const weeksAway = weeksUntil(milestone.week);
            const isPast = weeksAway < 0 && !done;
            const isThisWeek = weeksAway === 0;
            const catMeta = CATEGORY_META[milestone.category];
            const CatIcon = catMeta.icon;

            return (
              <Card
                key={milestone.id}
                className={cn(
                  'border transition-all',
                  done ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200',
                  isThisWeek && !done && 'border-amber-500/30 bg-amber-500/5'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                      const wasCompleted = isCompleted(milestone.id);
                      toggleMilestone(milestone.id);
                      upsertMilestone(user!.id, milestone.id, wasCompleted ? null : new Date().toISOString());
                    }}
                      className="mt-0.5 shrink-0 transition-colors"
                      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {done
                        ? <CheckCircle2 className="w-5 h-5 text-rose-400" />
                        : <Circle className="w-5 h-5 text-gray-300 hover:text-gray-500" />
                      }
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className={cn('font-medium text-sm', done ? 'line-through text-gray-400' : 'text-gray-900')}>
                          {milestone.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={cn('text-xs border', catMeta.bg, catMeta.color, catMeta.border)}>
                            <CatIcon className="w-3 h-3 mr-1" />
                            {catMeta.label}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{milestone.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">Week {milestone.week}</span>
                        {!done && (
                          <span className={cn(
                            'flex items-center gap-1 text-xs',
                            isPast ? 'text-rose-400' :
                            isThisWeek ? 'text-amber-400' :
                            weeksAway <= 2 ? 'text-amber-400/70' : 'text-gray-400'
                          )}>
                            <Clock className="w-3 h-3" />
                            {isPast
                              ? `${Math.abs(weeksAway)}w overdue`
                              : isThisWeek
                                ? 'This week'
                                : `in ${weeksAway}w`
                            }
                          </span>
                        )}
                        {done && (
                          <span className="text-xs text-emerald-500/70">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMilestones.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No milestones in this view.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
