'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ProductCard, ProductCardSkeleton } from '@/components/site/ProductCard';
import { mapProduct, PRODUCT_COLUMNS, type CatalogueProduct } from '@/lib/catalogue';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.cartegory as string;

  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const { data: category, error: catError } = await supabase
          .from('categories')
          .select('id, name, description')
          .eq('slug', categorySlug)
          .maybeSingle();

        if (catError) throw catError;
        if (cancelled) return;

        if (!category) {
          setProducts([]);
          setCategoryName(
            categorySlug
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          );
          setError(null);
          return;
        }

        setCategoryName(category.name);
        setDescription(category.description ?? '');

        const { data, error: prodError } = await supabase
          .from('products')
          .select(PRODUCT_COLUMNS)
          .eq('category_id', category.id)
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;
        if (cancelled) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setProducts((data ?? []).map((row: any) => mapProduct(row)));
        setError(null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        if (!cancelled) setError('We could not load this category. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return (
    <div className="bg-[color:var(--background)] py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--brand)]"
        >
          <ArrowLeft size={16} />
          All categories
        </Link>

        <div className="mt-6">
          <SectionHeading
            eyebrow="Catalogue"
            title={categoryName || 'Category'}
            intro={description || undefined}
          />
          {!loading && !error ? (
            <p className="mt-4 text-sm text-[color:var(--muted-ink)]">
              {products.length} {products.length === 1 ? 'item' : 'items'} available
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mt-16 text-center">
            <p className="text-[color:var(--destructive)]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {!loading && products.length === 0 ? (
              <div className="mt-16 text-center">
                <p className="text-[color:var(--muted-ink)]">
                  Nothing in this category yet — check back soon.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                >
                  Browse the full catalogue
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
