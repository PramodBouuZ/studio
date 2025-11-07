
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Promotion } from '@/lib/data';
import { doc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

const PROMO_ID = 'main-promotion';

export default function PromoBanner() {
    const firestore = useFirestore();
    const promotionDoc = useMemoFirebase(() => firestore ? doc(firestore, 'promotions', PROMO_ID) : null, [firestore]);
    const { data: promotion, isLoading: promotionLoading } = useDoc<Promotion>(promotionDoc);

    const image = promotion ? (PlaceHolderImages.find(img => img.id === promotion.imageId) || { imageUrl: promotion.imageId.startsWith('data:') ? promotion.imageId : '', description: promotion.title, imageHint: ''}) : null;

    if (promotionLoading) {
        return (
            <motion.section 
                className="py-16 sm:py-24"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Skeleton className="h-80 w-full" />
            </motion.section>
        )
    }
    
    if (!promotion) return null;

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
                                <span>{promotion.tagText}</span>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight font-headline sm:text-4xl mb-4 text-white">
                                {promotion.title}
                            </h2>
                            <p className="text-lg text-white/90 mb-8">
                                {promotion.description}
                            </p>
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
                                {promotion.buttonText} <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-64 md:h-full min-h-[300px] order-1 md:order-2">
                        {image && (
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
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
