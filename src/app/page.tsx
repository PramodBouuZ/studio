
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

export default function Home() {
  const inquirySectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToInquiry = () => {
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />

      <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center -mt-8 relative z-10 mb-8">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleScrollToInquiry}>
                    Submit Your Inquiry
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
      </div>
      
      <ScrollingBenefits />

      <div id="inquiry-section" ref={inquirySectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCatalog />
        <Testimonials />
      </div>
      <VendorShowcase />
    </div>
  );
}
