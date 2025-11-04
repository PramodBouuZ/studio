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

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Cloud Telephony Systems',
    description: 'Upgrade your business communication with our reliable and scalable cloud phone systems.',
    buttonText: 'Learn More',
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
    <section className="relative w-full h-[50vh] md:h-[60vh] bg-secondary">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {heroSlides.map((slide) => {
            const image = PlaceHolderImages.find((img) => img.id === slide.imageId);
            return (
              <CarouselItem key={slide.id}>
                <div className="relative w-full h-[50vh] md:h-[60vh]">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition-colors ${current === i ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
