import Image from 'next/image';
import { Sparkles, Trash2, Truck, Wrench, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import type { SiteService } from '@/lib/catalogue';

const ICONS: Record<string, LucideIcon> = {
  service_transportation: Truck,
  service_setup: Wrench,
  service_decoration: Sparkles,
  service_rentals_cleanup: Trash2,
};

interface ServicesSectionProps {
  services: SiteService[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-[color:var(--surface)] py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Featured Services"
            title="Beyond rentals — a full-service crew."
            intro="Transportation, setup, decoration and post-event cleanup, so you can be present with your guests instead of stacking chairs."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = ICONS[service.key] ?? Sparkles;

            return (
              <Reveal key={service.key} delay={Math.min(index, 5) * 60}>
                <article className="group overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-all duration-300 hover:shadow-brand">
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#f5f0e6]">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : null}
                    <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[color:var(--brand)] backdrop-blur">
                      <Icon size={18} />
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="relative inline-block font-serif text-xl">
                      {service.title}
                      <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[color:var(--brand)] transition-all duration-300 group-hover:w-full" />
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                      {service.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
