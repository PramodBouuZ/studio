
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function PromoBanner() {
    const image = PlaceHolderImages.find(img => img.id === 'hero-5');

    return (
        <motion.section 
            className="py-16 sm:py-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-2xl">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12 lg:p-16 order-2 md:order-1">
                        <div className="max-w-md">
                             <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/90 px-4 py-1.5 text-sm font-semibold text-accent-foreground shadow-md">
                                <Gift className="h-4 w-4" />
                                <span>Exclusive Customer Reward</span>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight font-headline sm:text-4xl mb-4 text-white">
                                Earn Up to 10% Commission!
                            </h2>
                            <p className="text-lg text-white/90 mb-8">
                                Post an inquiry and if your deal is successfully closed through our platform, you'll receive up to a 10% commission as a thank you. It pays to find the right vendor with BANTConfirm.
                            </p>
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
                                Post Your Inquiry Now <ArrowRight className="ml-2" />
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
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                </div>
            </Card>
        </motion.section>
    );
}
