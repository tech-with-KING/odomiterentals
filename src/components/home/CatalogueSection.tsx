'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ProductCard } from '@/components/site/ProductCard';
import type { CatalogueCategory, CatalogueProduct } from '@/lib/catalogue';

interface CatalogueSectionProps {
  products: CatalogueProduct[];
  categories: CatalogueCategory[];
}

export function CatalogueSection({ products, categories }: CatalogueSectionProps) {
  const [active, setActive] = useState('all');

  const filters = useMemo(
    () => [
      { key: 'all', label: 'All' },
      ...categories.filter((c) => c.count > 0).map((c) => ({ key: c.slug, label: c.name })),
    ],
    [categories]
  );

  const visible = useMemo(
    () => (active === 'all' ? products : products.filter((p) => p.categorySlug === active)),
    [products, active]
  );

  return (
    <section id="catalogue" className="bg-[color:var(--background)] py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Popular Rentals"
              title="Handpicked pieces guests actually notice."
              intro="Transparent per-day pricing on the items we rent most. Add anything to your booking in a click."
            />
          </Reveal>
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

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 5) * 60} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-[color:var(--muted-ink)]">
            No items in this category yet — check back soon.
          </p>
        ) : null}

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
          >
            View Full Catalogue
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CatalogueSection;
