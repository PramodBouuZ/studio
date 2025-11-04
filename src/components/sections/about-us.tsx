'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle } from 'lucide-react';

export default function AboutUsSection() {
  const image = PlaceHolderImages.find((img) => img.id === 'about-us');

  const features = [
    'AI-Powered Requirement Analysis',
    'Verified and Vetted Vendors',
    'Transparent Quoting Process',
    'BANT-Focused Matching',
    'End-to-End Project Support',
    'Secure and Reliable Platform',
  ];

  return (
    <section id="about-us" className="py-16 sm:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-6">
              About BANTConfirm Marketplace
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              BANTConfirm is a premier marketplace dedicated to simplifying the procurement process for telecom and IT services. Our mission is to connect businesses with the perfect vendors by leveraging AI-driven requirement analysis and a robust BANT (Budget, Authority, Need, Timeline) framework.
            </p>
            <p className="text-muted-foreground text-lg mb-8">
              We eliminate the guesswork and lengthy negotiations, providing a streamlined path to finding trusted partners who can deliver on your specific needs. Whether you're looking for a new VoIP system, cloud infrastructure, or specialized consulting, our platform ensures you get qualified, competitive proposals from top-tier providers.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 md:h-[450px] rounded-lg overflow-hidden shadow-xl">
            {image && (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
