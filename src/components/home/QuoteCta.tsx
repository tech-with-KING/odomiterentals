import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';

interface QuoteCtaProps {
  image?: string;
}

export function QuoteCta({ image }: QuoteCtaProps) {
  return (
    <section
      id="quote"
      className="relative isolate overflow-hidden bg-[color:var(--ink)] py-24 md:py-32"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ink)]/70 via-[color:var(--ink)]/85 to-[color:var(--ink)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <div className="eyebrow mb-4">Ready to plan</div>
          <h2 className="font-serif text-[clamp(1.875rem,3.8vw,3rem)] leading-[1.1] text-white">
            Planning an event? Let&apos;s make it effortless.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/75">
            Tell us the date, the guest count and the vibe — we&apos;ll come back with a clear,
            itemized quote in under 24 hours.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+18622306639"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <Phone size={16} />
              Call +1 862-230-6639
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default QuoteCta;
