'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);

    const timer = window.setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      window.clearInterval(timer);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured rental categories"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className="relative min-w-0 flex-[0_0_100%]"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <div className="relative h-[70vh] w-full overflow-hidden md:h-[88vh]">
                {slide.image ? (
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className={`object-cover ${selected === index ? 'ken-burns' : ''}`}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[color:var(--ink)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

                <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-center px-6">
                  <div
                    className="max-w-xl"
                    style={{
                      opacity: selected === index ? 1 : 0,
                      transform: selected === index ? 'translateY(0)' : 'translateY(12px)',
                      transition:
                        'opacity 700ms var(--ease-brand), transform 700ms var(--ease-brand)',
                    }}
                  >
                    <div className="eyebrow mb-4 text-[color:var(--brand)]">{slide.eyebrow}</div>
                    <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-white">
                      {slide.title}
                    </h1>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-white/85">
                      {slide.description}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/shop"
                        className="inline-flex items-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
                      >
                        Browse Catalogue
                      </Link>
                      <Link
                        href="#services"
                        className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-4 px-6 pb-8 md:pb-10">
          <div className="pointer-events-auto flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  selected === index ? 'w-10 bg-[color:var(--brand)]' : 'w-6 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={scrollPrev}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={scrollNext}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
