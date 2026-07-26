import { createClient } from '@supabase/supabase-js';

// Server-only: uses the service role key, which bypasses RLS.
// Never import this file from a 'use client' component.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
});
