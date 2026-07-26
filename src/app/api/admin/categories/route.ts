import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  let body: { name?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  if (!name) return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });

  const slug = slugify(name);
  if (!slug) return NextResponse.json({ error: 'Category name must contain letters or numbers.' }, { status: 400 });

  const { data: existing } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'A category with that name already exists.' }, { status: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug, description: body.description?.trim() ?? '' })
    .select('id, name, slug, description')
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
