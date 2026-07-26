'use client';

import { useState, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

type Mode = 'sign-in' | 'sign-up' | 'reset';

const COPY: Record<Mode, { title: string; description: string; submit: string }> = {
  'sign-in': {
    title: 'Sign In',
    description: 'Sign in to track your orders and manage your account.',
    submit: 'Sign In',
  },
  'sign-up': {
    title: 'Create an Account',
    description: 'Sign up to start booking rentals for your event.',
    submit: 'Sign Up',
  },
  reset: {
    title: 'Reset Password',
    description: "Enter your email and we'll send you a reset link.",
    submit: 'Send Reset Link',
  },
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.17-2 3.44-4.95 3.44-8.57Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.1 0 5.71-1.03 7.62-2.78l-3.72-2.9c-1.03.7-2.35 1.1-3.9 1.1-3 0-5.55-2.02-6.46-4.75H1.69v2.98A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.54 14.17a6.9 6.9 0 0 1 0-4.34V6.85H1.69a11.5 11.5 0 0 0 0 10.3l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.69 0 3.2.58 4.4 1.72l3.3-3.3C17.7 1.31 15.1.25 12 .25A11.5 11.5 0 0 0 1.69 6.85l3.85 2.98C6.45 7.1 9 4.77 12 4.77Z"
      />
    </svg>
  );
}

export function AuthDialog({ trigger, defaultMode = 'sign-in' }: { trigger: ReactNode; defaultMode?: Mode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const copy = COPY[mode];

  const resetState = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setMessage(null);
    setLoading(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setMessage(null);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      resetState();
      setMode(defaultMode);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // On success the browser navigates to Google, so there is nothing to reset.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'sign-in') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        setOpen(false);
        resetState();
      }
    } else if (mode === 'sign-up') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data.session) {
        // Email confirmation is off for this project — we are already signed in.
        setOpen(false);
        resetState();
      } else {
        setMessage('Check your email to confirm your account, then sign in.');
      }
    } else {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('If that email has an account, a reset link is on its way.');
      }
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        {mode !== 'reset' ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="relative my-2 text-center text-xs text-muted-foreground">
              <span className="bg-background relative z-10 px-2">or</span>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border" />
            </div>
          </>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'sign-up' ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="auth-name">Full name</Label>
              <Input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Doe"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {mode !== 'reset' ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">Password</Label>
                {mode === 'sign-in' ? (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    onClick={() => switchMode('reset')}
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
              <Input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              />
            </div>
          ) : null}

          {error && <p className="text-sm text-[color:var(--destructive)]">{error}</p>}
          {message && <p className="text-sm text-[color:var(--sage)]">{message}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Please wait...' : copy.submit}
          </Button>
        </form>

        <button
          type="button"
          className="text-center text-sm text-muted-foreground hover:text-foreground"
          onClick={() => switchMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        >
          {mode === 'sign-in'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </DialogContent>
    </Dialog>
  );
}
