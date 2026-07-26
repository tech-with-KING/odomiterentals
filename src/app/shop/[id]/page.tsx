import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ChevronRight, MessageSquare, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { ProductGallery } from '@/components/site/ProductGallery';
import { AddToQuoteButton } from '@/components/site/AddToQuoteButton';
import { ProductCard } from '@/components/site/ProductCard';
import { SectionHeading } from '@/components/site/SectionHeading';
import { getProductById, getRelatedProducts } from '@/lib/catalogue';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'Product not found — Odomite Rentals' };
  }

  const description =
    product.shortDescription ||
    product.description ||
    `Rent ${product.name} from Odomite Rentals in New Jersey.`;

  return {
    title: `${product.name} — Odomite Rentals`,
    description: description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Odomite Rentals`,
      description: description.slice(0, 160),
      images: product.image ? [product.image] : undefined,
    },
  };
}

const SERVICE_POINTS = [
  { icon: Truck, label: 'Delivery and pickup on your schedule' },
  { icon: Wrench, label: 'Setup and breakdown available' },
  { icon: ShieldCheck, label: 'Sanitized and inspected between rentals' },
];

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const related = await getRelatedProducts(product.categorySlug, product.id);

  const soldOut = !product.instock || product.unitsleft === 0;
  const lowStock =
    !soldOut && typeof product.unitsleft === 'number' && product.unitsleft > 0 && product.unitsleft <= 5;

  const badge = soldOut
    ? { label: 'Sold Out', tone: 'ink' as const }
    : lowStock
      ? { label: `Only ${product.unitsleft} left`, tone: 'amber' as const }
      : { label: 'In Stock', tone: 'sage' as const };

  const specs = [
    { label: 'Dimensions', value: product.dimensions },
    { label: 'Material', value: product.material },
    { label: 'Features', value: product.features },
    { label: 'Type', value: product.subcategory },
  ].filter((spec) => spec.value);

  return (
    <div className="bg-[color:var(--background)] py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link
            href="/shop"
            className="text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--brand)]"
          >
            Catalogue
          </Link>
          {product.categorySlug ? (
            <>
              <ChevronRight size={14} className="text-[color:var(--muted-ink)]" aria-hidden="true" />
              <Link
                href={`/shop/cartegory/${product.categorySlug}`}
                className="text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--brand)]"
              >
                {product.categoryName}
              </Link>
            </>
          ) : null}
          <ChevronRight size={14} className="text-[color:var(--muted-ink)]" aria-hidden="true" />
          <span className="font-medium text-[color:var(--ink)]" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} badge={badge} />

          <div>
            <div className="eyebrow mb-3">{product.categoryName}</div>

            <h1 className="font-sans text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-sans text-3xl font-semibold tracking-tight text-[color:var(--brand)]">
                ${product.price.toFixed(2)}
              </span>

              {product.isDiscounted ? (
                <>
                  <span className="text-lg text-[color:var(--muted-ink)]">
                    <span className="sr-only">Was </span>
                    <s className="decoration-[color:var(--muted-ink)]/60">
                      ${product.listPrice.toFixed(2)}
                    </s>
                  </span>
                  <span className="rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-[color:var(--brand-deep)]">
                    Save {product.discountPercent}%
                  </span>
                </>
              ) : null}

              <span className="text-sm text-[color:var(--muted-ink)]">per unit, per day</span>
            </div>

            {typeof product.unitsleft === 'number' && !soldOut ? (
              <p className="mt-2 text-sm text-[color:var(--muted-ink)]">
                {product.unitsleft} available
              </p>
            ) : null}

            {product.description ? (
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-ink)]">
                {product.description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {soldOut ? (
                <span className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--hairline)] px-8 text-sm font-medium text-[color:var(--muted-ink)]">
                  Currently unavailable
                </span>
              ) : (
                <AddToQuoteButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  listPrice={product.isDiscounted ? product.listPrice : undefined}
                  images={product.images}
                  desc={product.shortDescription || product.description}
                  category={product.categoryName}
                />
              )}

              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--hairline)] px-8 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              >
                <MessageSquare size={16} />
                Ask a question
              </Link>
            </div>

            <ul className="mt-8 space-y-3 border-t border-[color:var(--hairline)] pt-6">
              {SERVICE_POINTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                  <span className="text-sm text-[color:var(--muted-ink)]">{label}</span>
                </li>
              ))}
            </ul>

            {specs.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">
                  Specifications
                </h2>
                <dl className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)]">
                  {specs.map((spec, index) => (
                    <div
                      key={spec.label}
                      className={`grid grid-cols-1 gap-1 p-4 md:grid-cols-3 md:gap-3 ${
                        index !== specs.length - 1 ? 'border-b border-[color:var(--hairline)]' : ''
                      }`}
                    >
                      <dt className="text-sm font-medium text-[color:var(--muted-ink)]">
                        {spec.label}
                      </dt>
                      <dd className="text-sm text-[color:var(--ink)] md:col-span-2">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-[color:var(--hairline)] pt-16">
            <SectionHeading
              eyebrow="You might also need"
              title={`More from ${product.categoryName}`}
            />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
