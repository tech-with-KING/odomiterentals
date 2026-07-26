'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ProductCard, ProductCardSkeleton } from '@/components/site/ProductCard';
import { fetchCategories, fetchProducts, type CatalogueProduct } from '@/lib/catalogue';

type Filter = { key: string; label: string };

export default function ShopPage() {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [filters, setFilters] = useState<Filter[]>([{ key: 'all', label: 'All' }]);
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [rows, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (cancelled) return;

        setProducts(rows);
        setFilters([
          { key: 'all', label: 'All' },
          ...categories.map((c) => ({ key: c.slug, label: c.name })),
        ]);
        setError(null);
      } catch (err) {
        console.error('Error loading catalogue:', err);
        if (!cancelled) setError('We could not load the catalogue. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = active === 'all' || product.categorySlug === active;
      const matchesQuery =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.spec.toLowerCase().includes(term) ||
        product.categoryName.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [products, active, query]);

  return (
    <div className="bg-[color:var(--background)] py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Catalogue"
            title="Quality items tailored to your event."
            intro="Transparent per-day pricing across chairs, tables, tents, linens and equipment. Everything is inspected and sanitized between rentals."
          />

          <div className="relative w-full md:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-ink)]"
            />
            <label htmlFor="catalogue-search" className="sr-only">
              Search the catalogue
            </label>
            <input
              id="catalogue-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chairs, tents…"
              className="w-full rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface)] py-3 pl-11 pr-4 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted-ink)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
            />
          </div>
        </div>

        <div className="mt-8 -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActive(filter.key)}
              aria-pressed={active === filter.key}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active === filter.key
                  ? 'border-[color:var(--brand)] bg-[color:var(--brand)] text-white'
                  : 'border-[color:var(--hairline)] bg-[color:var(--surface)] text-[color:var(--ink)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
                : visible.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {!loading && visible.length === 0 ? (
              <p className="mt-16 text-center text-[color:var(--muted-ink)]">
                {products.length === 0
                  ? 'No items available at the moment — check back soon.'
                  : 'Nothing matches that filter yet. Try another category.'}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
