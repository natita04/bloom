'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useBloomStore } from '@/lib/store';
import { updateProfile } from '@/lib/db';
import { cn } from '@/lib/utils';

const steps = ['Due date', 'Pregnancy', 'Baby sex', 'Partner mode'];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, user } = useBloomStore();
  const [step, setStep] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [pregnancyNumber, setPregnancyNumber] = useState(1);
  const [babySex, setBabySex] = useState<'boy' | 'girl' | 'unknown'>('unknown');
  const [partnerMode, setPartnerMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    if (user) {
      await updateProfile(user.id, {
        due_date: dueDate,
        pregnancy_number: pregnancyNumber,
        baby_sex: babySex,
        partner_mode: partnerMode,
      });
    }
    setUser({
      id: user?.id ?? 'new-user',
      email: user?.email ?? 'user@bloom.app',
      name: user?.name ?? 'You',
      dueDate,
      pregnancyNumber,
      babySex,
      partnerMode,
      createdAt: new Date().toISOString(),
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1 rounded-full transition-all',
                i <= step ? 'bg-rose-500' : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        <div className="mb-6">
          <span className="text-4xl">🌸</span>
          <p className="text-gray-400 text-sm mt-2">Step {step + 1} of {steps.length}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{steps[step]}</h1>
        </div>

        {/* Step 0 — Due date */}
        {step === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-5">
              <p className="text-gray-500 text-sm mb-4">
                When is your estimated due date? This powers your week-by-week content and all personalization.
              </p>
              <Label htmlFor="dueDate" className="text-gray-600 text-sm">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-2 bg-gray-50 border-gray-300 text-gray-900 focus:border-rose-500/50"
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

        {/* Step 1 — Pregnancy number */}
        {step === 1 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-5">
              <p className="text-gray-500 text-sm mb-4">
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
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    )}
                  >
                    {n === 1 ? '1st' : n === 2 ? '2nd' : '3rd+'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-500" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Baby sex */}
        {step === 2 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-5">
              <p className="text-gray-500 text-sm mb-4">
                Do you know the sex of your baby? This is just for personalizing your experience — totally optional.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { value: 'girl' as const, label: 'Girl', emoji: '💗' },
                  { value: 'boy' as const, label: 'Boy', emoji: '💙' },
                  { value: 'unknown' as const, label: "Don't know", emoji: '🤍' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setBabySex(opt.value)}
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
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-500" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Partner mode */}
        {step === 3 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-5">
              <p className="text-gray-500 text-sm mb-4">
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
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-500" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading ? 'Setting up…' : "Let's go"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
