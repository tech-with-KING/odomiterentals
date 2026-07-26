'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCategories } from '@/lib/catalogue';
import { adminFetch } from '@/lib/admin-api';
import { PageHeader, AdminSpinner } from '@/components/admin/ui';
import {
  ProductForm,
  EMPTY_PRODUCT,
  type CategoryOption,
  type ProductFormValues,
} from '@/components/admin/product-form';

export default function AddProductPage() {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(EMPTY_PRODUCT);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((rows) => setCategories(rows.map(({ id, name }) => ({ id, name }))))
      .catch((err) => {
        console.error('Error loading categories:', err);
        setError('Could not load categories. Refresh to try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const { id } = await adminFetch<{ id: string }>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          price: Number(values.price),
          sale_price: values.sale_price.trim() === '' ? null : Number(values.sale_price),
          unitsleft: Number(values.unitsleft),
        }),
      });

      router.push(`/admin/inventory/edit_product/${id}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this product.');
      setSubmitting(false);
    }
  };

  if (loading) return <AdminSpinner label="Loading the form…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Inventory"
        title="Add a product"
        description="Saved products go live on the catalogue straight away."
      />

      <ProductForm
        values={values}
        onChange={setValues}
        categories={categories}
        submitting={submitting}
        error={error}
        submitLabel="Save product"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/inventory')}
      />
    </div>
  );
}
