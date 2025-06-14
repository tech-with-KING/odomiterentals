import FeaturedServicesCarousel from "@/components/FeatureServices";
import HeroBanner from "@/components/HeroBanner";
import Products from "@/components/Products";
import ScrollingTestimonials from "@/components/reviews";




export default function Home() {
  return (
    <>
      <HeroBanner />
      <Products />
      <FeaturedServicesCarousel />
      <ScrollingTestimonials />
      
    </>
   
  );
}
 