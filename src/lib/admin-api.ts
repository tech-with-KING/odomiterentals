import { supabase } from '@/lib/supabase';

/**
 * Calls an admin API route with the current Supabase session attached.
 *
 * The admin tables are locked down by RLS and written server-side with the
 * service role key, so the browser never writes to them directly — it proves
 * who it is with the access token and lets the route do the work.
 */
export async function adminFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error('Your session has expired. Please sign in again.');

  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status}).`);
  }

  return payload as T;
}
