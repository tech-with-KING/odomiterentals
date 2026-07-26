'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ProductCardSkeleton } from '@/components/site/ProductCard';
import { useCart } from '@/context/cart';
import { fetchProducts, type CatalogueProduct } from '@/lib/catalogue';

function QuantityStepper({
  product,
  quantity,
  onChange,
}: {
  product: CatalogueProduct;
  quantity: number;
  onChange: (id: string, quantity: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Remove one ${product.name}`}
        onClick={() => onChange(product.id, Math.max(0, quantity - 1))}
        disabled={quantity === 0}
        className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--hairline)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        min={0}
        aria-label={`Quantity of ${product.name}`}
        value={quantity || ''}
        placeholder="0"
        onChange={(e) => onChange(product.id, Math.max(0, parseInt(e.target.value, 10) || 0))}
        className="h-8 w-14 rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] text-center text-sm font-medium focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
      />
      <button
        type="button"
        aria-label={`Add one ${product.name}`}
        onClick={() => onChange(product.id, quantity + 1)}
        className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--hairline)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function QuotePage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((rows) => {
        if (!cancelled) {
          setProducts(rows);
          setError(null);
        }
      })
      .catch((err) => {
        console.error('Error loading products:', err);
        if (!cancelled) setError('We could not load the catalogue. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleQuantityChange = (id: string, quantity: number) =>
    setQuantities((prev) => ({ ...prev, [id]: quantity }));

  const selected = useMemo(
    () =>
      products
        .map((product) => ({ product, quantity: quantities[product.id] ?? 0 }))
        .filter((entry) => entry.quantity > 0),
    [products, quantities]
  );

  const total = selected.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity * duration,
    0
  );

  const handleRequestQuote = () => {
    selected.forEach(({ product, quantity }) => {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.image ? [product.image] : [],
          categories: [product.categoryName],
        },
        quantity,
        duration
      );
    });

    router.push('/checkout');
  };

  return (
    <div className="bg-[color:var(--background)] py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Request a Quote"
          title="Build your event list."
          intro="Set the quantities you need and the number of rental days. We'll come back with a clear, itemized quote in under 24 hours."
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {error ? (
              <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 text-center">
                <p className="text-[color:var(--destructive)]">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.map((product) => {
                      const quantity = quantities[product.id] ?? 0;

                      return (
                        <article
                          key={product.id}
                          className={`flex flex-col overflow-hidden rounded-2xl border bg-[color:var(--surface)] transition-colors ${
                            quantity > 0
                              ? 'border-[color:var(--brand)]'
                              : 'border-[color:var(--hairline)]'
                          }`}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0e6]">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
                                className="object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="flex flex-1 flex-col gap-3 p-5">
                            <div className="eyebrow text-[10px] text-[color:var(--muted-ink)]">
                              {product.categoryName}
                            </div>
                            <h3 className="line-clamp-2 font-serif text-base leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-sm">
                              <span className="font-serif text-lg font-semibold text-[color:var(--brand)]">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-[color:var(--muted-ink)]"> / unit / day</span>
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                              <QuantityStepper
                                product={product}
                                quantity={quantity}
                                onChange={handleQuantityChange}
                              />
                              {quantity > 0 ? (
                                <span className="text-sm font-medium text-[color:var(--ink)]">
                                  ${(product.price * quantity * duration).toFixed(2)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <h2 className="font-serif text-xl">Quote summary</h2>

              <div className="mt-5">
                <label
                  htmlFor="quote-duration"
                  className="text-sm font-medium text-[color:var(--ink)]"
                >
                  Rental duration
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease duration"
                    onClick={() => setDuration((d) => Math.max(1, d - 1))}
                    disabled={duration <= 1}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--hairline)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    id="quote-duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="h-8 w-14 rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] text-center text-sm font-medium focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
                  />
                  <button
                    type="button"
                    aria-label="Increase duration"
                    onClick={() => setDuration((d) => d + 1)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--hairline)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-[color:var(--muted-ink)]">
                    {duration === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[color:var(--hairline)] pt-5">
                {selected.length === 0 ? (
                  <p className="text-sm text-[color:var(--muted-ink)]">
                    Nothing selected yet. Set a quantity on any item to start your quote.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {selected.map(({ product, quantity }) => (
                      <li key={product.id} className="flex justify-between gap-3 text-sm">
                        <span className="min-w-0 flex-1 truncate text-[color:var(--muted-ink)]">
                          {product.name} × {quantity}
                        </span>
                        <span className="shrink-0 font-medium text-[color:var(--ink)]">
                          ${(product.price * quantity * duration).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-[color:var(--hairline)] pt-5">
                <span className="font-medium text-[color:var(--ink)]">Estimated total</span>
                <span className="font-serif text-xl font-semibold text-[color:var(--brand)]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleRequestQuote}
                disabled={selected.length === 0}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" />
                Request Quote
              </button>

              <p className="mt-3 text-center text-xs text-[color:var(--muted-ink)]">
                Adds your selection to the cart and takes you to checkout — no payment is taken
                online.
              </p>

              <p className="mt-4 text-center text-xs text-[color:var(--muted-ink)]">
                Prefer to talk?{' '}
                <Link href="/contact" className="text-[color:var(--brand)] hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
