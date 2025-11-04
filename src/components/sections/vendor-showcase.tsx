'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { vendors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from 'embla-carousel-autoplay';

export default function VendorShowcase() {
  return (
    <section id="vendors" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl font-headline">
            Our Trusted Vendors
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed">
            We partner with industry-leading companies to deliver exceptional quality and service.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            dragFree: true,
          }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full"
        >
          <CarouselContent>
            {vendors.map((vendor) => {
              const image = PlaceHolderImages.find((img) => img.id === vendor.imageId);
              return (
                <CarouselItem key={vendor.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <div className="p-4">
                    <div className="flex items-center justify-center h-28 p-6 bg-background rounded-lg shadow-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:shadow-xl hover:scale-105">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={vendor.name}
                          width={150}
                          height={75}
                          className="object-contain"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
