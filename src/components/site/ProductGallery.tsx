'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: { label: string; tone: 'sage' | 'amber' | 'ink' } | null;
}

const TONES = {
  sage: 'bg-[color:var(--sage)]',
  amber: 'bg-amber-500/95',
  ink: 'bg-[color:var(--ink)]/85',
};

export function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[#f5f0e6]">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[color:var(--muted-ink)]">
            <ImageIcon size={32} aria-hidden="true" />
          </div>
        )}

        {badge ? (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-white ${TONES[badge.tone]}`}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={index === active}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                index === active
                  ? 'border-[color:var(--brand)]'
                  : 'border-[color:var(--hairline)] hover:border-[color:var(--brand)]/50'
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ProductGallery;
