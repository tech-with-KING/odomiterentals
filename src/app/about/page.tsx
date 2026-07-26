import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, ShieldCheck, Sparkles, Truck, Users } from 'lucide-react';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/site/Reveal';
import { VALUE_PROPS } from '@/components/home/AboutSection';
import NewsletterSection from '@/components/newsletter';
import { getHomeData } from '@/lib/catalogue';

export const revalidate = 300;

export const metadata = {
  title: 'About Odomite Rentals — Family-owned event rentals in New Jersey',
  description:
    'Odomite Rentals is a family-run event rental company serving Newark, Elizabeth, Jersey City, Paterson and greater New Jersey with chairs, tables, tents, linens and full setup.',
};

const STATS = [
  { icon: Users, value: '500+', label: 'Events served' },
  { icon: Sparkles, value: '4.9 ★', label: '120+ Google reviews' },
  { icon: Truck, value: 'Same-day', label: 'Delivery available' },
  { icon: ShieldCheck, value: '100%', label: 'Sanitized between rentals' },
];

export default async function AboutPage() {
  const { categories, assets } = await getHomeData();
  const heroImage = assets.hero_banner_1 ?? assets.category_chairs ?? '';
  const secondaryImage = assets.category_tents ?? assets.hero_banner_2 ?? '';

  return (
    <div className="bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="About Us"
              title="A family-run crew that treats your event like ours."
              intro="Odomite Rentals runs on a simple promise: show up on time, bring clean inventory, and make the day easier for whoever is hosting. Everything else — the catalogue, the crew, the same-day swaps — follows from that."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
              >
                Browse Catalogue
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[color:var(--ink)]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="An Odomite Rentals event setup"
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <Icon className="mx-auto h-5 w-5 text-[color:var(--brand)]" aria-hidden="true" />
              <div className="mt-3 font-serif text-2xl font-semibold text-[color:var(--ink)]">
                {value}
              </div>
              <div className="mt-1 text-xs text-[color:var(--muted-ink)]">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--ink)]">
              {secondaryImage ? (
                <Image
                  src={secondaryImage}
                  alt="Tent and seating setup ready for guests"
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Why Odomite" title="Warm hospitality, professional delivery." />

            <ol className="mt-10 space-y-8">
              {VALUE_PROPS.map((item, index) => (
                <Reveal key={item.title} as="li" delay={index * 60} className="flex gap-5">
                  <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[color:var(--brand)] font-serif text-sm text-[color:var(--brand)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-serif text-lg text-[color:var(--ink)]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-[color:var(--muted-ink)]">
                      {item.body}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="What we carry"
            title="Everything your event needs, in one place."
            intro="Every category is inspected and sanitized between rentals."
          />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop/cartegory/${category.slug}`}
                className="group rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 transition-all duration-300 hover:border-[color:var(--brand)]/40 hover:shadow-brand"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg transition-colors group-hover:text-[color:var(--brand)]">
                    {category.name}
                  </h3>
                  <span className="shrink-0 text-xs text-[color:var(--muted-ink)]">
                    {category.count} {category.count === 1 ? 'item' : 'items'}
                  </span>
                </div>
                {category.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                    {category.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-[color:var(--brand-deep)]"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <MapPin className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-lg">Where you&apos;ll find us</h3>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
              331 Seymour Ave, Newark, NJ 07112. We deliver across Newark, Elizabeth, Jersey City,
              Paterson and greater New Jersey.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-[color:var(--brand-deep)]"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <Phone className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-lg">Talk to the owners</h3>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
              No call centre, no ticket queue.{' '}
              <a href="tel:+18622306639" className="text-[color:var(--brand)] hover:underline">
                +1 (862) 230-6639
              </a>{' '}
              or{' '}
              <a
                href="mailto:odomitegroupsllc@gmail.com"
                className="break-all text-[color:var(--brand)] hover:underline"
              >
                odomitegroupsllc@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
