'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImageIcon, Upload, Sparkles, Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generateContent } from '@/ai/flows/generate-content';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { HeroSlide } from '@/lib/data';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const initialSlides: HeroSlide[] = [
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


export default function HeroBannerPage() {
    const firestore = useFirestore();
    const slidesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'heroSlides') : null, [firestore]);
    const { data: slides, isLoading: slidesLoading } = useCollection<HeroSlide>(slidesCollection);
    
    const { toast } = useToast();
    const [generating, setGenerating] = useState<Record<string, boolean>>({});

    const getImageUrl = (imageId: string) => {
        return PlaceHolderImages.find(img => img.id === imageId)?.imageUrl || (imageId.startsWith('data:') ? imageId : '');
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
        if (!firestore) return;
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const imageUrl = event.target?.result as string;
                await setDoc(doc(firestore, 'heroSlides', slideId), { imageId: imageUrl }, { merge: true });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, slideId: string) => {
        if (!firestore) return;
        await setDoc(doc(firestore, 'heroSlides', slideId), { [e.target.name]: e.target.value }, { merge: true });
    }

    const handleSaveChanges = (slideId: string) => {
        const slide = slides?.find(s => s.id === slideId);
        toast({
            title: 'Hero Banner Saved',
            description: `Changes to "${slide?.title}" have been saved.`,
        });
    };

    const handleGenerateContent = async (slideId: string, contentType: 'title' | 'description' | 'buttonText' | 'image') => {
        if (!firestore) return;
        const slide = slides?.find(s => s.id === slideId);
        if (!slide) return;
    
        const fieldKey = `${slideId}-${contentType}`;
        setGenerating(prev => ({...prev, [fieldKey]: true}));
    
        try {
            const slideRef = doc(firestore, 'heroSlides', slideId);
            if (contentType === 'image') {
                const result = await generateContent({ prompt: slide.title, generateImage: true });
                if (result.imageUrl) {
                    await setDoc(slideRef, { imageId: result.imageUrl }, { merge: true });
                    toast({ title: 'AI Image Generated!', description: 'The image has been updated.' });
                }
            } else {
                const result = await generateContent({ prompt: slide.title, contentType: contentType });
                if (result.generatedText) {
                    await setDoc(slideRef, { [contentType]: result.generatedText }, { merge: true });
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
        const batch = writeBatch(firestore);
        initialSlides.forEach(slide => {
            const docRef = doc(firestore, "heroSlides", slide.id);
            batch.set(docRef, slide);
        });
        await batch.commit();
        toast({ title: 'Initial slides seeded!' });
    };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Hero Banner</h1>
            <p className="text-muted-foreground">Update the rotating slides on the homepage hero section.</p>
        </div>
        {!slidesLoading && slides?.length === 0 && (
            <Button onClick={seedInitialData} variant="outline">Seed Initial Slides</Button>
        )}
      </div>
      <div className="grid gap-6">
        {slidesLoading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-96 w-full"/>)}
        {slides?.map((slide) => (
            <Card key={slide.id}>
                <CardHeader>
                    <CardTitle>Edit Slide: {slide.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`title-${slide.id}`}>Title</Label>
                            <div className="flex gap-2">
                                <Input id={`title-${slide.id}`} name="title" defaultValue={slide.title} onBlur={(e) => handleInputChange(e, slide.id)} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent(slide.id, 'title')} disabled={generating[`${slide.id}-title`]}>
                                    {generating[`${slide.id}-title`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`description-${slide.id}`}>Description</Label>
                             <div className="flex gap-2">
                                <Textarea id={`description-${slide.id}`} name="description" defaultValue={slide.description} onBlur={(e) => handleInputChange(e, slide.id)} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent(slide.id, 'description')} disabled={generating[`${slide.id}-description`]}>
                                     {generating[`${slide.id}-description`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`buttonText-${slide.id}`}>Button Text</Label>
                             <div className="flex gap-2">
                                <Input id={`buttonText-${slide.id}`} name="buttonText" defaultValue={slide.buttonText} onBlur={(e) => handleInputChange(e, slide.id)} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent(slide.id, 'buttonText')} disabled={generating[`${slide.id}-buttonText`]}>
                                     {generating[`${slide.id}-buttonText`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden">
                            {getImageUrl(slide.imageId) ? (
                                <Image src={getImageUrl(slide.imageId)} alt={slide.title} fill className="object-cover" />
                            ) : (
                                <div className="text-center text-muted-foreground space-y-1">
                                    <ImageIcon className="mx-auto h-8 w-8" />
                                    <p>No image</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor={`upload-${slide.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </label>
                            </Button>
                             <Button variant="outline" className="w-full" onClick={() => handleGenerateContent(slide.id, 'image')} disabled={generating[`${slide.id}-image`]}>
                                {generating[`${slide.id}-image`] ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 text-accent" />}
                                Generate with AI
                            </Button>
                            <input id={`upload-${slide.id}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, slide.id)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSaveChanges(slide.id)}>Save Changes</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
