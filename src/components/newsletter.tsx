'use client';

import { useState, type FormEvent } from 'react';
import { Reveal } from '@/components/site/Reveal';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }

      setStatus('done');
      setEmail('');
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section className="bg-[color:var(--background)] py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="rounded-3xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 text-center md:p-12">
            <div className="eyebrow mb-3">Newsletter</div>
            <h2 className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
              Stay in the loop.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--muted-ink)]">
              Promotions, new arrivals and the occasional early-access offer — sent when we actually
              have something worth sharing.
            </p>

            {status === 'done' ? (
              <p className="mt-7 text-sm font-medium text-[color:var(--brand-deep)]">
                You&apos;re on the list — check your inbox for a confirmation.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface)] px-5 py-3 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted-ink)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30 sm:rounded-r-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)] disabled:opacity-60 sm:rounded-l-none"
                >
                  {status === 'sending' ? 'Subscribing…' : 'Subscribe Now'}
                </button>
              </form>
            )}

            {error ? (
              <p className="mt-4 text-sm text-[color:var(--destructive)]">{error}</p>
            ) : null}

            <p className="mt-4 text-xs text-[color:var(--muted-ink)]">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
