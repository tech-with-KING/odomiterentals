'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchCategories } from '@/lib/catalogue';
import { adminFetch } from '@/lib/admin-api';
import { useFeedback } from '@/context/feedback';
import { AdminSpinner, EmptyState, PageHeader } from '@/components/admin/ui';
import {
  ProductForm,
  EMPTY_PRODUCT,
  type CategoryOption,
  type ProductFormValues,
} from '@/components/admin/product-form';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { confirm, toast } = useFeedback();
  const productId = params?.id;

  const [values, setValues] = useState<ProductFormValues>(EMPTY_PRODUCT);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Read straight off the URL rather than useSearchParams(), which would force
  // this page behind a Suspense boundary just for one flag.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('created') === '1') setSaved(true);
  }, []);

  useEffect(() => {
    if (!productId) return;
    let active = true;

    Promise.all([
      supabase
        .from('products')
        .select(
          'id, name, category_id, subcategory, price, sale_price, unitsleft, instock, short_description, description, dimensions, material, features, images'
        )
        .eq('id', productId)
        .maybeSingle(),
      fetchCategories(),
    ])
      .then(([productRes, categoryRows]) => {
        if (!active) return;
        if (productRes.error) throw productRes.error;

        setCategories(categoryRows.map(({ id, name }) => ({ id, name })));

        if (!productRes.data) {
          setNotFound(true);
          return;
        }

        const row = productRes.data;
        setValues({
          name: row.name ?? '',
          category_id: row.category_id ?? '',
          subcategory: row.subcategory ?? '',
          price: String(row.price ?? ''),
          sale_price: row.sale_price === null || row.sale_price === undefined ? '' : String(row.sale_price),
          unitsleft: String(row.unitsleft ?? 0),
          instock: row.instock !== false,
          short_description: row.short_description ?? '',
          description: row.description ?? '',
          dimensions: row.dimensions ?? '',
          material: row.material ?? '',
          features: row.features ?? '',
          images: row.images ?? [],
        });
      })
      .catch((err) => {
        console.error('Error loading product:', err);
        if (active) setError('Could not load this product. Refresh to try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSaved(false);

    try {
      await adminFetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...values,
          price: Number(values.price),
          sale_price: values.sale_price.trim() === '' ? null : Number(values.sale_price),
          unitsleft: Number(values.unitsleft),
        }),
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your changes.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: `Delete ${values.name || 'this product'}?`,
      description:
        'It comes off the live catalogue straight away. Past orders keep their record of it. This cannot be undone.',
      confirmLabel: 'Delete product',
      tone: 'danger',
    });
    if (!confirmed) return;

    setSubmitting(true);
    setError(null);

    try {
      await adminFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      toast({ title: 'Product deleted', tone: 'success' });
      router.push('/admin/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this product.');
      setSubmitting(false);
    }
  };

  if (loading) return <AdminSpinner label="Loading product…" />;

  if (notFound) {
    return (
      <EmptyState
        title="Product not found"
        description="It may have been deleted, or the link is out of date."
        action={
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--brand)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to inventory
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Inventory"
        title={values.name || 'Edit product'}
        description="Changes go live on the catalogue as soon as you save."
        actions={
          <>
            <Link
              href={`/shop/${productId}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
            >
              View on site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--ink)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Inventory
            </Link>
          </>
        }
      />

      {saved ? (
        <p className="inline-flex items-center gap-2 rounded-lg bg-[#e7efe9] px-4 py-3 text-sm font-medium text-[color:var(--sage)]">
          <Check className="h-4 w-4" />
          Saved. This product is live on the catalogue.
        </p>
      ) : null}

      <ProductForm
        values={values}
        onChange={(next) => {
          setSaved(false);
          setValues(next);
        }}
        categories={categories}
        submitting={submitting}
        error={error}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/inventory')}
        onDelete={handleDelete}
      />
    </div>
  );
}
