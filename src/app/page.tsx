
'use client';

import { useRef } from 'react';
import HeroSection from '@/components/sections/hero';
import ScrollingBenefits from '@/components/sections/scrolling-benefits';
import ProductCatalog from '@/components/sections/product-catalog';
import VendorShowcase from '@/components/sections/vendor-showcase';
import Testimonials from '@/components/sections/testimonials';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AIChat from '@/components/ai-chat';
import PromoBanner from '@/components/sections/promo-banner';

export default function Home() {
  const inquirySectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToInquiry = () => {
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection onCTAClick={handleScrollToInquiry} />
      
      <ScrollingBenefits />

      <div id="inquiry-section" ref={inquirySectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCatalog />
        <PromoBanner />
        <Testimonials />
      </div>
      <VendorShowcase />
    </div>
  );
}
