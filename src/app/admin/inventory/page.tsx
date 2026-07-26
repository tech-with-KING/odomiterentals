'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Pencil, Plus, Search } from 'lucide-react';
import { fetchProducts, type CatalogueProduct } from '@/lib/catalogue';
import {
  AdminSpinner,
  EmptyState,
  ErrorNote,
  PageHeader,
  Panel,
  StatusPill,
  formatMoney,
} from '@/components/admin/ui';

const LOW_STOCK_THRESHOLD = 10;

type StockFilter = 'all' | 'instock' | 'lowstock' | 'outofstock' | 'onsale';

const STOCK_FILTERS: { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'instock', label: 'In stock' },
  { value: 'lowstock', label: 'Running low' },
  { value: 'outofstock', label: 'Out of stock' },
  { value: 'onsale', label: 'On sale' },
];

const controlClass =
  'rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none transition-colors focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20';

function stockState(product: CatalogueProduct) {
  const units = product.unitsleft ?? 0;
  if (!product.instock || units === 0) return { label: 'Out of stock', tone: 'bad' as const };
  if (units <= LOW_STOCK_THRESHOLD) return { label: 'Running low', tone: 'warn' as const };
  return { label: 'In stock', tone: 'good' as const };
}

export default function InventoryPage() {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stock, setStock] = useState<StockFilter>('all');

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((rows) => {
        if (active) setProducts(rows);
      })
      .catch((err) => {
        console.error('Error loading products:', err);
        if (active) setError('Could not load your inventory. Refresh to try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.categoryName).filter(Boolean))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      if (category !== 'all' && product.categoryName !== category) return false;

      const units = product.unitsleft ?? 0;
      const isOut = !product.instock || units === 0;
      if (stock === 'instock' && isOut) return false;
      if (stock === 'outofstock' && !isOut) return false;
      if (stock === 'lowstock' && (isOut || units > LOW_STOCK_THRESHOLD)) return false;
      if (stock === 'onsale' && !product.isDiscounted) return false;

      if (!term) return true;
      return (
        product.name.toLowerCase().includes(term) ||
        product.categoryName.toLowerCase().includes(term) ||
        product.spec.toLowerCase().includes(term)
      );
    });
  }, [products, search, category, stock]);

  const totalUnits = filtered.reduce((sum, p) => sum + (p.unitsleft ?? 0), 0);
  const onSale = products.filter((p) => p.isDiscounted).length;

  if (loading) return <AdminSpinner label="Loading inventory…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Inventory"
        title="Everything you rent out"
        description="Counts here are what customers see on the catalogue. Keep them current as items go out and come back."
        actions={
          <Link
            href="/admin/inventory/add_product"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-deep)] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        }
      />

      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-ink)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category or spec"
            aria-label="Search products"
            className={`${controlClass} w-full pl-9`}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className={controlClass}
        >
          <option value="all">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <div
          role="group"
          aria-label="Filter by stock level"
          className="flex rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] p-0.5"
        >
          {STOCK_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStock(option.value)}
              aria-pressed={stock === option.value}
              className={`rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors ${
                stock === option.value
                  ? 'bg-[color:var(--ink)] text-white'
                  : 'text-[color:var(--muted-ink)] hover:text-[color:var(--ink)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Panel
        title={`${filtered.length} of ${products.length} products`}
        description={`${totalUnits.toLocaleString('en-US')} units in this view${
          onSale > 0 ? ` · ${onSale} on sale` : ''
        }`}
        bodyClassName="p-0"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title={products.length === 0 ? 'No products yet' : 'Nothing matches those filters'}
            description={
              products.length === 0
                ? 'Add your first rental item and it appears on the live catalogue straight away.'
                : 'Try a different search term or clear the filters.'
            }
            action={
              products.length === 0 ? (
                <Link
                  href="/admin/inventory/add_product"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-deep)] hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add product
                </Link>
              ) : null
            }
          />
        ) : (
          <ul className="divide-y divide-[color:var(--hairline)]">
            {filtered.map((product) => {
              const state = stockState(product);
              return (
                <li key={product.id}>
                  <Link
                    href={`/admin/inventory/edit_product/${product.id}`}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[color:var(--muted)] sm:px-5"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[color:var(--muted)]">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Package className="absolute inset-0 m-auto h-5 w-5 text-[color:var(--muted-ink)]" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{product.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-[color:var(--muted-ink)]">
                        {product.categoryName}
                        {product.spec ? ` · ${product.spec}` : ''}
                      </span>
                    </span>

                    <span className="hidden sm:block">
                      <StatusPill tone={state.tone}>{state.label}</StatusPill>
                    </span>

                    <span className="spec w-16 shrink-0 text-right text-sm tabular-nums text-[color:var(--muted-ink)]">
                      {(product.unitsleft ?? 0).toLocaleString('en-US')}
                      <span className="block text-[10px] uppercase tracking-wider">units</span>
                    </span>

                    <span className="w-24 shrink-0 text-right">
                      <span
                        className={`spec block text-sm font-semibold tabular-nums ${
                          product.isDiscounted ? 'text-[color:var(--brand-deep)]' : ''
                        }`}
                      >
                        {formatMoney(product.price)}
                      </span>
                      {product.isDiscounted ? (
                        <span className="spec block text-[11px] tabular-nums text-[color:var(--muted-ink)]">
                          <s>{formatMoney(product.listPrice)}</s>
                          <span className="ml-1">−{product.discountPercent}%</span>
                        </span>
                      ) : null}
                    </span>

                    <Pencil className="hidden h-4 w-4 shrink-0 text-[color:var(--muted-ink)] transition-colors group-hover:text-[color:var(--brand-deep)] sm:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
