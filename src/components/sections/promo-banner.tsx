
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

export default function PromoBanner() {
    const image = PlaceHolderImages.find(img => img.id === 'hero-4');

    return (
        <section className="py-16 sm:py-24">
            <Card className="overflow-hidden bg-primary/5 text-foreground shadow-lg">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12 lg:p-16 order-2 md:order-1">
                        <div className="max-w-md">
                             <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                                <Zap className="h-4 w-4" />
                                <span>Limited Time Offer</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl mb-4">
                                Supercharge Your Sales Pipeline
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                For a limited time, get 3 months of our premium lead generation service for the price of one. Unlock qualified leads and accelerate your growth today.
                            </p>
                            <Button size="lg">
                                Claim Offer <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-64 md:h-full min-h-[300px] order-1 md:order-2">
                        {image && (
                            <Image
                                src={image.imageUrl}
                                alt="Promotional banner image"
                                fill
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                            />
                        )}
                    </div>
                </div>
            </Card>
        </section>
    );
}
