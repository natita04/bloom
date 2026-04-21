'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useBloomStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const steps = ['Due date', 'Pregnancy', 'Partner mode'];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, user } = useBloomStore();
  const [step, setStep] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [pregnancyNumber, setPregnancyNumber] = useState(1);
  const [partnerMode, setPartnerMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    // TODO: Save to Supabase
    setUser({
      id: user?.id ?? 'new-user',
      email: user?.email ?? 'user@bloom.app',
      name: user?.name ?? 'You',
      dueDate,
      pregnancyNumber,
      partnerMode,
      createdAt: new Date().toISOString(),
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1 rounded-full transition-all',
                i <= step ? 'bg-rose-500' : 'bg-zinc-800'
              )}
            />
          ))}
        </div>

        <div className="mb-6">
          <span className="text-4xl">🌸</span>
          <p className="text-zinc-500 text-sm mt-2">Step {step + 1} of {steps.length}</p>
          <h1 className="text-2xl font-bold text-white mt-1">{steps[step]}</h1>
        </div>

        {step === 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
              <p className="text-zinc-400 text-sm mb-4">
                When is your estimated due date? This powers your week-by-week content and all personalization.
              </p>
              <Label htmlFor="dueDate" className="text-zinc-300 text-sm">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:border-rose-500/50"
              />
              <Button
                className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white"
                disabled={!dueDate}
                onClick={() => setStep(1)}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
              <p className="text-zinc-400 text-sm mb-4">
                Is this your first pregnancy? This helps us tailor behavioral insights.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setPregnancyNumber(n)}
                    className={cn(
                      'py-3 rounded-xl border text-sm font-medium transition-all',
                      pregnancyNumber === n
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    )}
                  >
                    {n === 1 ? '1st' : n === 2 ? '2nd' : '3rd+'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-400"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
              <p className="text-zinc-400 text-sm mb-4">
                Partner mode gives read-only access to a partner or support person. They can see your milestone status and weekly content, but not your mood logs.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Just me', value: false },
                  { label: 'Enable partner', value: true },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setPartnerMode(opt.value)}
                    className={cn(
                      'py-3 rounded-xl border text-sm font-medium transition-all',
                      partnerMode === opt.value
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-400"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading ? 'Setting up…' : 'Let\'s go'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
