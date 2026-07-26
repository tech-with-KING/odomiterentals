import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface AdminIdentity {
  id: string;
  email: string;
  name: string;
  privilege: 'dev' | 'admin';
}

/**
 * Verifies the caller is a signed-in admin.
 *
 * Admin writes go through the service role key, which bypasses RLS — so every
 * route that uses `supabaseAdmin` must call this first. The browser sends its
 * Supabase access token as a bearer token; we resolve it to a user server-side
 * (the token is signed by Supabase, so it cannot be forged) and then require a
 * matching row in `admins`.
 *
 * Returns either the admin identity or a ready-to-return error response.
 */
export async function requireAdmin(
  request: Request
): Promise<{ admin: AdminIdentity; error?: never } | { admin?: never; error: NextResponse }> {
  const header = request.headers.get('authorization') ?? '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';

  if (!token) {
    return { error: NextResponse.json({ error: 'Not signed in.' }, { status: 401 }) };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const email = data?.user?.email;

  if (error || !email) {
    return { error: NextResponse.json({ error: 'Session expired. Sign in again.' }, { status: 401 }) };
  }

  const { data: adminRow, error: adminError } = await supabaseAdmin
    .from('admins')
    .select('id, email, name, privilege')
    .eq('email', email)
    .maybeSingle();

  if (adminError) {
    console.error('Admin lookup failed:', adminError);
    return { error: NextResponse.json({ error: 'Could not verify admin access.' }, { status: 500 }) };
  }

  if (!adminRow) {
    return { error: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }

  return { admin: adminRow as AdminIdentity };
}
