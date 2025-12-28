// components/SignOutButton.jsx
'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignOutButton({ redirectTo = '/sign-in', children = 'Sign out' }) {
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    if (pending) return;
    setPending(true);
    try {
      // NextAuth will clear the session and redirect
      await signOut({ redirect: true, callbackUrl: redirectTo });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignOut}
      disabled={pending}
      aria-busy={pending}
      style={{background:"black"}}
    >
      {pending ? 'Signing out…' : children}
    </Button>
  );
}
