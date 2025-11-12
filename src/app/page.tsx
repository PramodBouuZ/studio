'use client';

import HeroSection from '@/components/sections/hero';
import ScrollingBenefits from '@/components/sections/scrolling-benefits';
import ProductCatalog from '@/components/sections/product-catalog';
import VendorShowcase from '@/components/sections/vendor-showcase';
import Testimonials from '@/components/sections/testimonials';
import PromoBanner from '@/components/sections/promo-banner';
import AboutUsSection from '@/components/sections/about-us';

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      
      <div className="pb-12">
        <ScrollingBenefits />
      </div>

      <div id="inquiry-section" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCatalog />
        <PromoBanner />
        <Testimonials />
      </div>
      <AboutUsSection />
      <VendorShowcase />
    </main>
  );
}
