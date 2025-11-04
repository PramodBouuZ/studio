'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const heroBanners = [
  {
    title: 'Find Your Perfect Vendor Match',
    description: 'Our AI-powered platform connects you with top-tier vendors tailored to your needs.',
    imageId: 'hero-1',
  },
  {
    title: 'Unlock Business Growth',
    description: 'Access a marketplace of services designed to scale your operations.',
    imageId: 'hero-2',
  },
  {
    title: 'Seamless Collaboration',
    description: 'Streamline your procurement process with our intuitive and powerful tools.',
    imageId: 'hero-3',
  },
  {
    title: 'Trusted by Industry Leaders',
    description: 'Join thousands of businesses that trust BANTConfirm for their vendor needs.',
    imageId: 'hero-4',
  },
  {
    title: 'Innovate Faster',
    description: 'Get the resources you need to bring your most ambitious projects to life.',
    imageId: 'hero-5',
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      <Carousel
        className="w-full h-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {heroBanners.map((banner, index) => {
            const image = PlaceHolderImages.find((img) => img.id === banner.imageId);
            return (
              <CarouselItem key={index} className="relative h-full">
                <div className="absolute inset-0 bg-black/50 z-10" />
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    priority={index === 0}
                  />
                )}
                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg font-headline">
                    {banner.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
                    {banner.description}
                  </p>
                  <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                    Submit Your Inquiry
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 text-white hover:text-primary" />
          <CarouselNext className="relative right-0 top-0 translate-y-0 text-white hover:text-primary" />
        </div>
      </Carousel>
    </section>
  );
}
