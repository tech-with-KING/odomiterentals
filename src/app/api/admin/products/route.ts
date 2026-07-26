import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { buildProductPayload } from '@/lib/product-payload';
import { friendlyDbError } from '@/lib/supabase-errors';

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const built = buildProductPayload(body, { partial: false });
  if ('error' in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(built.payload)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating product:', error);
    const status = error.code === '23514' ? 400 : 500;
    return NextResponse.json({ error: friendlyDbError(error) }, { status });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
