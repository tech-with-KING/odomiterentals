'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared shell pieces for the admin pages.
 *
 * House rules, so every screen reads as one tool:
 *  - every count, price and identifier is set in the mono face with tabular
 *    figures, because this is a counting tool and columns have to line up
 *  - panels are white on paper with a hairline border, never a drop shadow
 *  - status is carried by colour + word, never colour alone
 */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1 className="mt-1.5 font-serif text-3xl leading-tight tracking-tight md:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--muted-ink)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  description,
  actions,
  bodyClassName,
  className,
  children,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface)]',
        className
      )}
    >
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--hairline)] px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-serif text-lg leading-none">{title}</h2>
            {description ? (
              <p className="mt-1.5 text-xs text-[color:var(--muted-ink)]">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}

/** A single headline number. `tone` marks the one that needs acting on. */
export function StatBlock({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'neutral' | 'attention' | 'good';
}) {
  const accent = {
    neutral: 'text-[color:var(--ink)]',
    attention: 'text-[color:var(--brand-deep)]',
    good: 'text-[color:var(--sage)]',
  }[tone];

  return (
    <div className="rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--muted-ink)]">
        {label}
      </div>
      <div className={cn('spec mt-3 text-4xl font-semibold tabular-nums', accent)}>{value}</div>
      {hint ? <div className="mt-1.5 text-xs text-[color:var(--muted-ink)]">{hint}</div> : null}
    </div>
  );
}

export type PillTone = 'neutral' | 'good' | 'warn' | 'bad' | 'info';

const PILL_TONES: Record<PillTone, string> = {
  neutral: 'bg-[color:var(--muted)] text-[color:var(--muted-ink)]',
  good: 'bg-[#e7efe9] text-[color:var(--sage)]',
  warn: 'bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]',
  bad: 'bg-[#f7e4e3] text-[color:var(--destructive)]',
  info: 'bg-[#e8ecf2] text-[#3a5075]',
};

export function StatusPill({ tone = 'neutral', children }: { tone?: PillTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold',
        PILL_TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {icon ? (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[color:var(--muted)] text-[color:var(--muted-ink)]">
          {icon}
        </div>
      ) : null}
      <p className="font-serif text-lg">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-[color:var(--muted-ink)]">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AdminSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--hairline)] border-t-[color:var(--brand)]"
        aria-hidden="true"
      />
      <p className="text-sm text-[color:var(--muted-ink)]">{label}</p>
    </div>
  );
}

/** Inline, dismissible-free error line — used above forms and tables. */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-[color:var(--destructive)]/25 bg-[#fdf3f2] px-4 py-3 text-sm text-[color:var(--destructive)]">
      {children}
    </p>
  );
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
