'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid link. No token provided.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;

    if (!token) {
      setError('Invalid token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setPending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Password set successfully!');
        router.replace('/sign-in');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server');
    } finally {
      setPending(false);
    }
  };

  if (!token && error) {
    return (
      <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
        <TriangleAlert />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
          <TriangleAlert />
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-1">
        <label className="text-sm font-medium">New Password</label>
        <Input
          type="password"
          disabled={pending}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          type="password"
          disabled={pending}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white"
        size="lg"
        disabled={pending}
      >
        {pending ? 'Saving...' : 'Set Password'}
      </Button>
    </form>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[90%] sm:w-[420px] shadow-xl border-slate-200">
        <CardHeader className="text-center space-y-1 pb-4 border-b">
          <CardTitle className="text-2xl font-bold text-[#1e3a8a]">Welcome Aboard</CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Set your password to activate your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Suspense fallback={<div className="text-center text-sm text-slate-500">Loading secure token...</div>}>
            <SetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
