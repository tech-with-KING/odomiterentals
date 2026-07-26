-- Newsletter subscribers.
--
-- Signups are written server-side by /api/newsletter with the service role key,
-- so this table needs no INSERT policy. Admins read it through /api/admin/subscribers
-- (also service role); the SELECT policy below exists so that a direct client-side
-- read from an admin session still works and anon reads return nothing.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "admin read newsletter_subscribers" on public.newsletter_subscribers;
create policy "admin read newsletter_subscribers"
  on public.newsletter_subscribers
  for select
  using (
    exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );
