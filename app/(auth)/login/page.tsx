'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useBloomStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useBloomStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name ?? email.split('@')[0],
        dueDate: data.user.user_metadata?.due_date ?? '',
        pregnancyNumber: data.user.user_metadata?.pregnancy_number ?? 1,
        partnerMode: data.user.user_metadata?.partner_mode ?? false,
        createdAt: data.user.created_at,
      });
    }
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🌸</span>
          <h1 className="text-2xl font-bold text-white mt-3">bloom</h1>
          <p className="text-zinc-400 text-sm mt-1">Your pregnancy, understood.</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-zinc-300 text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-rose-500/50"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-zinc-300 text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-rose-500/50"
                />
              </div>
              {error && (
                <p className="text-rose-400 text-sm">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-zinc-500 text-sm">
                No account?{' '}
                <Link href="/signup" className="text-rose-400 hover:text-rose-300">
                  Create one
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                onClick={handleGoogleLogin}
                type="button"
              >
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
