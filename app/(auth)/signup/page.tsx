'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // If email confirmation is enabled, show a message; otherwise go to onboarding
    if (data.user && data.session) {
      router.push('/onboarding');
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <span className="text-4xl">🌸</span>
          <h2 className="text-white text-xl font-bold mt-4 mb-2">Check your email</h2>
          <p className="text-zinc-400 text-sm">
            We sent a confirmation link to <span className="text-white">{email}</span>.
            Click it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🌸</span>
          <h1 className="text-2xl font-bold text-white mt-3">bloom</h1>
          <p className="text-zinc-400 text-sm mt-1">Start tracking your journey.</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Create account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="At least 8 characters"
                  minLength={8}
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
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                onClick={handleGoogleSignup}
                type="button"
              >
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-zinc-500 text-sm mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-rose-400 hover:text-rose-300">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-zinc-600 text-xs mt-4 max-w-xs mx-auto">
          Your data is private by default.
        </p>
      </div>
    </div>
  );
}
