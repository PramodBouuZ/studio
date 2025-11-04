
'use client';

import { useRef } from 'react';
import HeroSection from '@/components/sections/hero';
import ScrollingBenefits from '@/components/sections/scrolling-benefits';
import ProductCatalog from '@/components/sections/product-catalog';
import VendorShowcase from '@/components/sections/vendor-showcase';
import Testimonials from '@/components/sections/testimonials';
import PromoBanner from '@/components/sections/promo-banner';
import AboutUsSection from '@/components/sections/about-us';
import { useAIChat } from '@/components/ai-chat';

export default function Home() {
  const inquirySectionRef = useRef<HTMLDivElement>(null);
  const { openChat } = useAIChat();

  const handleInquiryClick = () => {
    openChat();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection onCTAClick={handleInquiryClick} />
      
      <div className="py-8 text-center">
        {/* This button is now handled by the context and can be removed or kept as a secondary CTA.
            For now, the primary CTA is in the Hero section.
            If we keep it, it should also trigger openChat().
        */}
      </div>

      <div className="pb-12">
        <ScrollingBenefits />
      </div>

      <div id="inquiry-section" ref={inquirySectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCatalog />
        <PromoBanner />
        <Testimonials />
      </div>
      <AboutUsSection />
      <VendorShowcase />
    </div>
  );
}
