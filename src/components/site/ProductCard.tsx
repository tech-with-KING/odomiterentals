'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { BookNowPopup } from '@/components/ui/BookNowPopUp';
import type { CatalogueProduct } from '@/lib/catalogue';

interface ProductCardProps {
  product: CatalogueProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  // Decorative only, exactly as in the reference design — nothing persists it yet.
  const [wishlisted, setWishlisted] = useState(false);

  const lowStock =
    typeof product.unitsleft === 'number' && product.unitsleft > 0 && product.unitsleft <= 5;
  const soldOut = !product.instock || product.unitsleft === 0;

  const stockLabel = soldOut ? 'Sold Out' : lowStock ? 'Limited' : 'In Stock';
  const stockTone = soldOut
    ? 'bg-[color:var(--ink)]/85'
    : lowStock
      ? 'bg-amber-500/95'
      : 'bg-[color:var(--sage)]';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]/40 hover:shadow-brand">
      <div className="relative aspect-square overflow-hidden bg-[#f5f0e6]">
        <Link href={`/shop/${product.id}`} className="block h-full w-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[color:var(--muted-ink)]">
              <ShoppingBag size={28} aria-hidden="true" />
            </div>
          )}
        </Link>

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-white ${stockTone}`}
        >
          {stockLabel}
        </span>

        {product.isDiscounted ? (
          <span className="absolute right-3 top-3 rounded-full bg-[color:var(--brand-deep)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
            {product.discountPercent}% off
          </span>
        ) : null}

        {/* Sits bottom-right so it never collides with the discount pill above. */}
        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] group-hover:opacity-100"
        >
          <Heart
            size={16}
            className={
              wishlisted
                ? 'fill-[color:var(--brand)] text-[color:var(--brand)]'
                : 'text-[color:var(--ink)]'
            }
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="eyebrow text-[10px] text-[color:var(--muted-ink)]">
          {product.categoryName}
        </div>

        <h3 className="line-clamp-2 font-sans text-base font-semibold leading-snug text-[color:var(--ink)]">
          <Link href={`/shop/${product.id}`} className="transition-colors hover:text-[color:var(--brand)]">
            {product.name}
          </Link>
        </h3>

        {product.spec ? (
          <p className="line-clamp-1 text-sm text-[color:var(--muted-ink)]">{product.spec}</p>
        ) : null}

        <div className="mt-1 flex items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-sans text-xl font-semibold tracking-tight text-[color:var(--brand)]">
              ${product.price.toFixed(2)}
              <span className="ml-1 text-xs font-normal text-[color:var(--muted-ink)]">/day</span>
            </span>

            {product.isDiscounted ? (
              <span className="text-sm text-[color:var(--muted-ink)]">
                <span className="sr-only">Was </span>
                <s className="decoration-[color:var(--muted-ink)]/60">
                  ${product.listPrice.toFixed(2)}
                </s>
              </span>
            ) : null}
          </div>
          {typeof product.unitsleft === 'number' ? (
            <span className="shrink-0 text-xs text-[color:var(--muted-ink)]">
              {product.unitsleft} available
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-2">
          {soldOut ? (
            <span className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-medium text-[color:var(--muted-ink)]">
              Currently unavailable
            </span>
          ) : (
            <BookNowPopup
              product={{
                id: product.id,
                images: product.images,
                name: product.name,
                price: product.price,
                listPrice: product.isDiscounted ? product.listPrice : undefined,
                desc: product.desc,
                categories: [product.categoryName],
              }}
              trigger={
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--brand)] px-4 py-2.5 text-sm font-medium text-[color:var(--brand)] transition-colors duration-200 hover:bg-[color:var(--brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2"
                >
                  <ShoppingBag size={16} />
                  Add to Booking
                </button>
              }
            />
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)]">
      <div className="aspect-square skeleton" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-3/5 rounded" />
        <div className="skeleton mt-2 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export default ProductCard;
