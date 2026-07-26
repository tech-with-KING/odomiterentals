import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { data, error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('id, email, source, status, created_at, unsubscribed_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading subscribers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribers: data ?? [] });
}
