import HeroCarousel, { type HeroSlide } from '@/components/home/HeroCarousel';
import TrustBar from '@/components/home/TrustBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import CatalogueSection from '@/components/home/CatalogueSection';
import ServicesSection from '@/components/home/ServicesSection';
import AboutSection from '@/components/home/AboutSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import QuoteCta from '@/components/home/QuoteCta';
import NewsletterSection from '@/components/newsletter';
import { getHomeData } from '@/lib/catalogue';

// Rendered on the server so the page ships with its catalogue in the markup;
// re-fetched at most once a minute so admin inventory edits surface quickly.
export const revalidate = 60;

const HERO_COPY = [
  {
    assetKey: 'hero_banner_1',
    eyebrow: 'Chair Rentals',
    title: 'Seating that sets the tone.',
    description:
      'From chiavari to folding — inspected, sanitized and delivered ready to seat your guests.',
  },
  {
    assetKey: 'hero_banner_2',
    eyebrow: 'Table Rentals',
    title: 'Tables built for every gathering.',
    description: 'Rounds, banquets and cocktail tables in the exact counts your event calls for.',
  },
  {
    assetKey: 'service_sound_equipment',
    eyebrow: 'Equipment Rentals',
    title: 'The details guests remember.',
    description:
      'Sound, lighting and serving equipment — professionally maintained and event-ready.',
  },
  {
    assetKey: 'category_tents',
    eyebrow: 'Tent Rentals',
    title: 'Shelter that still looks the part.',
    description:
      'Frame tents from intimate 10×10 to full 20×40 spans, staked and secured by our crew.',
  },
  {
    assetKey: 'service_rentals_cleanup',
    eyebrow: 'Setup Services',
    title: 'We stage. You celebrate.',
    description:
      'Full setup, styling and post-event breakdown so you can be present with your guests.',
  },
];

export default async function Home() {
  const { products, categories, services, assets } = await getHomeData();

  const slides: HeroSlide[] = HERO_COPY.map(({ assetKey, ...copy }) => ({
    ...copy,
    image: assets[assetKey] ?? '',
  }));

  const aboutImage = assets.hero_banner_1 ?? assets.category_chairs ?? '';
  const quoteImage = assets.category_tents ?? assets.hero_banner_2 ?? '';

  return (
    <>
      <HeroCarousel slides={slides} />
      <TrustBar />
      <CategoryGrid categories={categories} />
      <CatalogueSection products={products} categories={categories} />
      <ServicesSection services={services} />
      <AboutSection image={aboutImage} />
      <ReviewsSection />
      <QuoteCta image={quoteImage} />
      <NewsletterSection />
    </>
  );
}
