import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import type { CatalogueCategory } from '@/lib/catalogue';

interface CategoryGridProps {
  categories: CatalogueCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="bg-[color:var(--surface)] py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Shop by Category"
            title="Everything your event needs."
            intro="Every category is inspected, sanitized and ready to deliver — from intimate backyard dinners to full-tent weddings."
          />
        </Reveal>

        <div className="mt-12 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal
              key={category.id}
              delay={Math.min(index, 5) * 60}
              className="w-[70%] shrink-0 snap-start md:w-auto md:shrink"
            >
              <Link
                href={`/shop/cartegory/${category.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 70vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-white">{category.name}</h3>
                    <p className="text-xs text-white/75">
                      {category.count} {category.count === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <span className="grid h-11 w-11 translate-x-3 place-items-center rounded-full bg-[color:var(--brand)] text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
