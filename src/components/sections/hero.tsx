'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useAIChat } from '../ai-chat';

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Find The Right Vendor, Faster.',
    description: 'Describe your needs, and our AI-powered platform will connect you with top-tier vendors.',
    buttonText: 'Submit Your Inquiry',
    imageId: 'hero-1',
  },
  {
    id: 'hero-2',
    title: 'Unlock Business Growth',
    description: 'Access a marketplace of services designed to scale your operations.',
    buttonText: 'Explore Services',
    imageId: 'hero-2',
  },
  {
    id: 'hero-3',
    title: 'Seamless Collaboration',
    description: 'Streamline your procurement process with our intuitive and powerful tools.',
    buttonText: 'Get Started',
    imageId: 'hero-3',
  },
];

export default function HeroSection() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { openChat } = useAIChat();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] bg-secondary">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => {
            const image = PlaceHolderImages.find((img) => img.id === slide.imageId);
            return (
              <CarouselItem key={slide.id}>
                <div className="relative w-full h-[70vh] md:h-[80vh]">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 lg:p-16">
                    <div className="max-w-3xl text-white drop-shadow-md">
                       <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        {slide.description}
                      </p>
                      
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
                            onClick={openChat}
                        >
                            {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${current === i ? 'w-4 bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
