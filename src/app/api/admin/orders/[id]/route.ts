import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Permanently delete one order.
 *
 * Items go first: the foreign key from `order_items` may not cascade, and a
 * half-deleted order — items gone, header still listed — is worse than one
 * that failed cleanly. Both statements are scoped to the single id, so no
 * other booking can be touched.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'No order specified.' }, { status: 400 });
  }

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .delete()
    .eq('order_id', id);

  if (itemsError) {
    console.error(`Error deleting items for order ${id}:`, itemsError);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // `select` so we can tell "deleted" apart from "was never there".
  const { data, error } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error(`Error deleting order ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'That order no longer exists.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, id });
}
