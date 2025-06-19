'use client';
import FeaturedServicesCarousel from "@/components/FeatureServices";
import GlobalHeader from "@/components/GlobalHeader";
import HeroBanner from "@/components/HeroBanner";
import NewsletterSection from "@/components/newsletter";
import Products, { Services } from "@/components/Products";
import ScrollingTestimonials from "@/components/reviews";




export default function Home() {
  return (
    <>
      <HeroBanner />
      <Products />
      <Services />
      <FeaturedServicesCarousel />
       <GlobalHeader
        title="Reviews"
        description="Your one-stop solution for all event rental needs. Explore our wide range of products and services to make your event unforgettable."
        buttonText="View All"
        buttonHref="/get-started"
        className="mb-4 mt-8"
      /> 
      
      <ScrollingTestimonials />
      <NewsletterSection />
    </>
   
  );
}
 