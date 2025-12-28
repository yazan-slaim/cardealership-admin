'use client';

import React, { useState } from 'react';

// shadcn ui
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import Link from 'next/link';

// icons
import { FaGithub } from 'react-icons/fa';
// import { FcGoogle } from 'react-icons/fc'; // only if you add Google provider

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // tiny helper to wait for session to populate
  const getSessionWithRetry = async (tries = 5, delayMs = 80) => {
    let s = await getSession();
    for (let i = 0; i < tries && !s; i++) {
      await new Promise(r => setTimeout(r, delayMs));
      s = await getSession();
    }
    return s;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.ok) {
        const session = await getSessionWithRetry();
        const id = session?.user?.id;

        toast.success('Login successful');

        if (id) {
          router.replace(`/agents/${id}`);
          router.refresh?.();
        } else {
          // fallback if id missing
          router.replace('/');
        }
        return;
      }

      if (res?.error === 'CredentialsSignin' || res?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError(res?.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Something went wrong');
    } finally {
      setPending(false);
    }
  };

  const handleProvider = async (event, provider) => {
    event.preventDefault();
    // For OAuth, send them to a callback page that reads session and redirects:
    // e.g., '/auth/callback' (see snippet below)
    await signIn(provider, { callbackUrl: '/auth/callback' });
  };

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Sign in</CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground">
            Use email or a provider to sign in
          </CardDescription>
        </CardHeader>

        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? 'Signing in…' : 'Continue'}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="flex my-2 justify-evenly mx-auto items-center">
            <Button
              disabled={pending}
              onClick={(e) => handleProvider(e, 'github')}
              variant="outline"
              size="lg"
              className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
            >
              <FaGithub className="size-8 left-2.5 top-2.5" />
            </Button>

            {/* Enable if you add Google provider on the server:
            <Button
              disabled={pending}
              onClick={(e) => handleProvider(e, 'google')}
              variant="outline"
              size="lg"
              className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
            >
              <FcGoogle className="size-8 left-2.5 top-2.5" />
            </Button> */}
          </div>

          <p className="text-center text-sm mt-2 text-muted-foreground">
            Create a new account
            <Link
              className="text-sky-700 ml-4 hover:underline cursor-pointer"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
