import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { buildProductPayload } from '@/lib/product-payload';
import { friendlyDbError } from '@/lib/supabase-errors';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const built = buildProductPayload(body, { partial: true });
  if ('error' in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(built.payload)
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error updating product:', error);
    const status = error.code === '23514' ? 400 : 500;
    return NextResponse.json({ error: friendlyDbError(error) }, { status });
  }
  if (!data) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  return NextResponse.json({ id: data.id });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await params;

  // order_items keeps a product_id reference; null it out first so deleting a
  // product never takes order history with it.
  const { error: unlinkError } = await supabaseAdmin
    .from('order_items')
    .update({ product_id: null })
    .eq('product_id', id);

  if (unlinkError) {
    console.error('Error unlinking order items:', unlinkError);
    return NextResponse.json({ error: unlinkError.message }, { status: 500 });
  }

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
