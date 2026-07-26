'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Mail, Search, Trash2 } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';
import { useFeedback } from '@/context/feedback';
import {
  AdminSpinner,
  EmptyState,
  ErrorNote,
  PageHeader,
  Panel,
  StatBlock,
  StatusPill,
} from '@/components/admin/ui';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: 'subscribed' | 'unsubscribed';
  created_at: string;
  unsubscribed_at: string | null;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const { confirm, toast } = useFeedback();

  useEffect(() => {
    let active = true;

    adminFetch<{ subscribers: Subscriber[] }>('/api/admin/subscribers')
      .then(({ subscribers: rows }) => {
        if (active) setSubscribers(rows);
      })
      .catch((err) => {
        console.error('Error loading subscribers:', err);
        if (active) setError(err instanceof Error ? err.message : 'Could not load subscribers.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(term));
  }, [subscribers, search]);

  const activeCount = subscribers.filter((s) => s.status === 'subscribed').length;

  const thisMonth = useMemo(() => {
    const now = new Date();
    return subscribers.filter((s) => {
      const created = new Date(s.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [subscribers]);

  const exportCsv = () => {
    const rows = [
      ['email', 'status', 'source', 'signed_up'],
      ...filtered.map((s) => [s.email, s.status, s.source, new Date(s.created_at).toISOString()]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `odomite-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (subscriber: Subscriber) => {
    const confirmed = await confirm({
      title: 'Remove this subscriber?',
      description: `${subscriber.email} will be taken off the list. They can sign up again from the site.`,
      confirmLabel: 'Remove',
      tone: 'danger',
    });
    if (!confirmed) return;

    setRemoving(subscriber.id);
    setError(null);

    try {
      await adminFetch(`/api/admin/subscribers/${subscriber.id}`, { method: 'DELETE' });
      setSubscribers((prev) => prev.filter((s) => s.id !== subscriber.id));
      toast({ title: 'Subscriber removed', tone: 'success' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove that subscriber.');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <AdminSpinner label="Loading subscribers…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Marketing"
        title="Newsletter list"
        description="Everyone who signed up through the site. Export the list to send a campaign from your email tool."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBlock label="Subscribed" value={String(activeCount)} tone="good" />
        <StatBlock label="New this month" value={String(thisMonth)} />
        <StatBlock
          label="Unsubscribed"
          value={String(subscribers.length - activeCount)}
          hint="Kept on record so they are not re-added"
        />
      </div>

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-ink)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email"
          aria-label="Search subscribers"
          className="w-full rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
        />
      </div>

      <Panel title={`${filtered.length} on the list`} bodyClassName="p-0">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-5 w-5" />}
            title={subscribers.length === 0 ? 'No signups yet' : 'No matching email'}
            description={
              subscribers.length === 0
                ? 'Signups from the footer form on the site will collect here.'
                : 'Try a different search term.'
            }
          />
        ) : (
          <ul className="divide-y divide-[color:var(--hairline)]">
            {filtered.map((subscriber) => (
              <li
                key={subscriber.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[color:var(--muted)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{subscriber.email}</p>
                  <p className="spec mt-0.5 text-[11px] tabular-nums text-[color:var(--muted-ink)]">
                    {new Date(subscriber.created_at).toLocaleDateString()} · via {subscriber.source}
                  </p>
                </div>

                <StatusPill tone={subscriber.status === 'subscribed' ? 'good' : 'neutral'}>
                  {subscriber.status}
                </StatusPill>

                <button
                  type="button"
                  onClick={() => remove(subscriber)}
                  disabled={removing === subscriber.id}
                  aria-label={`Remove ${subscriber.email}`}
                  className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--muted-ink)] transition-colors hover:bg-[#f7e4e3] hover:text-[color:var(--destructive)] disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
