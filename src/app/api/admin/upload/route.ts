import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'product-images';
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'image'
  );
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Could not read the upload.' }, { status: 400 });
  }

  const files = form.getAll('files').filter((entry): entry is File => entry instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'No image selected.' }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `${file.name} is not a supported image (use JPG, PNG, WebP, AVIF or GIF).` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `${file.name} is larger than 8MB. Compress it and try again.` },
        { status: 400 }
      );
    }

    const extension = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'jpg';
    const path = `${slugify(file.name)}-${crypto.randomUUID().slice(0, 8)}.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });

    if (error) {
      console.error('Error uploading image:', error);
      return NextResponse.json({ error: `Could not upload ${file.name}.` }, { status: 500 });
    }

    urls.push(supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  return NextResponse.json({ urls }, { status: 201 });
}
