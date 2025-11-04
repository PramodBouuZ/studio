import HeroSection from '@/components/sections/hero';
import ScrollingBenefits from '@/components/sections/scrolling-benefits';
import InquirySection from '@/components/sections/inquiry';
import ProductCatalog from '@/components/sections/product-catalog';
import VendorShowcase from '@/components/sections/vendor-showcase';
import Testimonials from '@/components/sections/testimonials';
import CoreCategories from '@/components/sections/core-categories';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <ScrollingBenefits />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CoreCategories />
        <InquirySection />
        <ProductCatalog />
        <Testimonials />
      </div>
      <VendorShowcase />
    </div>
  );
}
