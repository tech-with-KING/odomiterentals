import Image from 'next/image';
import { Star } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';

export const VALUE_PROPS = [
  {
    title: 'Transparent per-day pricing',
    body: 'Clear rates on every item, with the counts right on the card — no surprise line items on your invoice.',
  },
  {
    title: 'Sanitized and inspected inventory',
    body: 'Every chair, table and linen is cleaned between rentals and inspected before it leaves our warehouse.',
  },
  {
    title: 'Flexible same-day changes',
    body: 'Guest count shifted the morning of? Call us. We accommodate last-minute swaps whenever we can.',
  },
  {
    title: 'Locally owned in New Jersey',
    body: "A family-run team serving the Newark, Elizabeth and greater NJ area — you'll talk to the owners, not a call center.",
  },
];

interface AboutSectionProps {
  image?: string;
}

export function AboutSection({ image }: AboutSectionProps) {
  return (
    <section id="about" className="bg-[color:var(--background)] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--ink)]">
            {image ? (
              <Image
                src={image}
                alt="A styled reception setup with round tables, chairs and warm lighting"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-white/95 p-4 shadow-brand backdrop-blur sm:-right-6 sm:p-5">
            <div
              className="grid h-10 w-10 place-items-center rounded-full"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <Star size={18} className="fill-[color:var(--brand)] text-[color:var(--brand)]" />
            </div>
            <div>
              <div className="font-serif text-lg font-semibold text-[color:var(--ink)]">4.9 ★</div>
              <div className="text-xs text-[color:var(--muted-ink)]">120+ Google reviews</div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading eyebrow="Why Odomite" title="Warm hospitality, professional delivery." />
          </Reveal>

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
    </section>
  );
}

export default AboutSection;
