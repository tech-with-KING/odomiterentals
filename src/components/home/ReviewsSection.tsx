'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';

const REVIEWS = [
  {
    name: 'Connie G',
    date: '4 months ago',
    rating: 5,
    comment:
      'They were very professional, on time and they actually picked up the tables and chairs at the end of our party. We called them and they came quick. I will definitely do more rentals with them. I recommend Odomite Rentals to everyone.',
  },
  {
    name: 'K. Grant',
    date: 'a month ago',
    rating: 5,
    comment:
      'Service was great! We had a last minute holiday party. Steven was able to supply our requested table and chairs colors with no problem. Communication was excellent.',
  },
  {
    name: 'Darnell Brunson',
    date: 'a year ago',
    rating: 5,
    comment:
      'I was looking around for rental chairs but I wanted a certain look. So I found this amazing rental company on Facebook marketplace. Did my research on the internet and found them to be legit. This was the best decision I’ve made. I own an intimate event space and will be using them for all my events! Communication and delivery, let’s not forget pricing, was all on point!! Thank you Thank you Thank you!',
  },
  {
    name: 'Simply Stefené',
    date: '4 months ago',
    rating: 5,
    comment:
      'I had such a great experience renting chairs for a small party. The transaction was smooth and the owner was super nice. I will be returning and recommending this company!',
  },
  {
    name: 'Stephanie Homem',
    date: 'a year ago',
    rating: 5,
    comment:
      'Everything was perfect — we rented for Thanksgiving! Scheduled for pick up and delivery and everything went very smoothly. Very friendly and very professional. I will be renting from this company again. The chairs and table were clean. When I called, they answered all my questions and everything he said was done. Very pleased. Thank you so much!',
  },
];

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 md:p-7">
      <header className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 place-items-center rounded-full font-serif text-lg text-[color:var(--brand-deep)]"
          style={{ backgroundColor: 'var(--brand-soft)' }}
        >
          {review.name[0]}
        </div>
        <div>
          <div className="font-medium text-[color:var(--ink)]">{review.name}</div>
          <div className="text-xs text-[color:var(--muted-ink)]">{review.date}</div>
        </div>
      </header>

      <div className="mt-4 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={15} className="fill-[color:var(--brand)] text-[color:var(--brand)]" />
        ))}
      </div>

      <p
        className={`mt-4 text-[15px] leading-relaxed text-[color:var(--ink)]/85 ${
          expanded ? '' : 'line-clamp-5'
        }`}
      >
        “{review.comment}”
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 self-start text-sm font-medium text-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </article>
  );
}

export function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [canScroll, setCanScroll] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setCanScroll(emblaApi.canScrollNext());
  }, [emblaApi]);

  return (
    <section className="bg-[color:var(--surface)] py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Reviews"
              title="What our customers say."
              intro="Your one-stop solution for all event rental needs."
            />
          </Reveal>

          {canScroll ? (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous review"
                onClick={scrollPrev}
                className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--hairline)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next review"
                onClick={scrollNext}
                className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--hairline)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_33.333%]"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
