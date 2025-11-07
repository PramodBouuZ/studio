'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImageIcon, Upload, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generateContent } from '@/ai/flows/generate-content';
import type { Promotion } from '@/lib/data';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


const initialPromotion: Promotion = {
    id: 'promo-main-1',
    title: 'Find Your Perfect Match',
    description: 'For a limited time, get premium access to our marketplace and receive exclusive offers from our network of trusted vendors. Find the perfect partner for your next project and bring your vision to life.',
    buttonText: 'Claim Offer',
    imageId: 'hero-4',
    tagText: 'Limited Time Offer'
};

const PROMO_ID = 'main-promotion';

export default function PromotionsPage() {
    const firestore = useFirestore();
    const promotionDoc = useMemoFirebase(() => firestore ? doc(firestore, 'promotions', PROMO_ID) : null, [firestore]);
    const { data: promotion, isLoading: promotionLoading } = useDoc<Promotion>(promotionDoc);
    
    const { toast } = useToast();
    const [generating, setGenerating] = useState<Record<string, boolean>>({});

    const getImageUrl = (imageId: string | undefined) => {
        if (!imageId) return '';
        return PlaceHolderImages.find(img => img.id === imageId)?.imageUrl || (imageId.startsWith('data:') ? imageId : '');
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!firestore) return;
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const imageUrl = event.target?.result as string;
                await setDoc(doc(firestore, 'promotions', PROMO_ID), { imageId: imageUrl }, { merge: true });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!firestore) return;
        await setDoc(doc(firestore, 'promotions', PROMO_ID), { [e.target.name]: e.target.value }, { merge: true });
    }

    const handleSaveChanges = () => {
        toast({
            title: 'Promotion Saved',
            description: `Changes to the promotional banner have been saved.`,
        });
    };

    const handleGenerateContent = async (contentType: 'tagText' | 'title' | 'description' | 'buttonText' | 'image') => {
        if (!firestore || !promotion) return;
        const fieldKey = contentType;
        setGenerating(prev => ({...prev, [fieldKey]: true}));
    
        try {
            const promoRef = doc(firestore, 'promotions', PROMO_ID);
            if (contentType === 'image') {
                const result = await generateContent({ prompt: promotion.title, generateImage: true });
                if (result.imageUrl) {
                    await setDoc(promoRef, { imageId: result.imageUrl }, { merge: true });
                    toast({ title: 'AI Image Generated!', description: 'The image has been updated.' });
                }
            } else {
                const result = await generateContent({ prompt: promotion.title, contentType: contentType });
                if (result.generatedText) {
                    await setDoc(promoRef, { [contentType]: result.generatedText }, { merge: true });
                    toast({ title: `AI ${contentType} Generated!` });
                }
            }
        } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'AI Generation Failed', description: 'Could not generate content. Please try again.' });
        } finally {
          setGenerating(prev => ({...prev, [fieldKey]: false}));
        }
    };
    
    const seedInitialData = async () => {
        if (!firestore) return;
        await setDoc(doc(firestore, "promotions", PROMO_ID), initialPromotion);
        toast({ title: 'Initial promotion seeded!' });
    };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Promotion Banner</h1>
            <p className="text-muted-foreground">Update the main promotional banner displayed on the homepage.</p>
        </div>
         {!promotionLoading && !promotion && (
            <Button onClick={seedInitialData} variant="outline">Seed Initial Promotion</Button>
        )}
      </div>
      <div className="grid gap-6">
        {promotionLoading && <Skeleton className="h-[500px] w-full" />}
        {promotion && (
            <Card>
                <CardHeader>
                    <CardTitle>Edit Promotion</CardTitle>
                    <CardDescription>Update the content for the promotional banner.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tagText">Tag Text (e.g., Limited Time Offer)</Label>
                            <div className="flex gap-2">
                                <Input id="tagText" name="tagText" defaultValue={promotion.tagText} onBlur={handleInputChange} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent('tagText')} disabled={generating.tagText}>
                                    {generating.tagText ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                             <div className="flex gap-2">
                                <Input id="title" name="title" defaultValue={promotion.title} onBlur={handleInputChange} />
                                 <Button variant="outline" size="icon" onClick={() => handleGenerateContent('title')} disabled={generating.title}>
                                    {generating.title ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <div className="flex gap-2">
                                <Textarea id="description" name="description" defaultValue={promotion.description} onBlur={handleInputChange} rows={4} />
                                 <Button variant="outline" size="icon" onClick={() => handleGenerateContent('description')} disabled={generating.description}>
                                    {generating.description ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="buttonText">Button Text</Label>
                            <div className="flex gap-2">
                                <Input id="buttonText" name="buttonText" defaultValue={promotion.buttonText} onBlur={handleInputChange} />
                                 <Button variant="outline" size="icon" onClick={() => handleGenerateContent('buttonText')} disabled={generating.buttonText}>
                                    {generating.buttonText ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden">
                            {getImageUrl(promotion.imageId) ? (
                                <Image src={getImageUrl(promotion.imageId)} alt={promotion.title} fill className="object-cover" />
                            ) : (
                                <div className="text-center text-muted-foreground space-y-1">
                                    <ImageIcon className="mx-auto h-8 w-8" />
                                    <p>No image</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor={`upload-${promotion.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </label>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => handleGenerateContent('image')} disabled={generating.image}>
                                {generating.image ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 text-accent" />}
                                Generate with AI
                            </Button>
                            <input id={`upload-${promotion.id}`} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            </Card>
        )}
         {!promotionLoading && !promotion && (
             <div className="col-span-full text-center py-16 text-muted-foreground border rounded-lg">
                <p>No promotion has been created yet.</p>
            </div>
         )}
      </div>
    </div>
  );
}
