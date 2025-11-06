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

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageId: string;
};

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
    const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
    const { toast } = useToast();
    const [generating, setGenerating] = useState<Record<string, boolean>>({});

    const getImageUrl = (imageId: string) => {
        // Find in original placeholders or temporary (data: URL) images
        return PlaceHolderImages.find(img => img.id === imageId)?.imageUrl || (imageId.startsWith('data:') ? imageId : '');
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setSlides(slides.map(s => s.id === slideId ? {...s, imageId: imageUrl} : s));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, slideId: string) => {
        setSlides(slides.map(p => p.id === slideId ? {...p, [e.target.name]: e.target.value} : p));
    }

    const handleSaveChanges = (slideId: string) => {
        const slide = slides.find(s => s.id === slideId);
        // This is where you would save to a database in a real app
        console.log('Saving slide:', slide);
        toast({
            title: 'Hero Banner Saved',
            description: `Changes to "${slide?.title}" have been saved.`,
        });
    };

    const handleGenerateContent = async (slideId: string, contentType: 'title' | 'description' | 'buttonText' | 'image') => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide) return;
    
        const fieldKey = `${slideId}-${contentType}`;
        setGenerating(prev => ({...prev, [fieldKey]: true}));
    
        try {
            if (contentType === 'image') {
                const result = await generateContent({ prompt: slide.title, generateImage: true });
                if (result.imageUrl) {
                    setSlides(prevSlides => prevSlides.map(s => s.id === slideId ? { ...s, imageId: result.imageUrl! } : s));
                    toast({ title: 'AI Image Generated!', description: 'The image has been updated.' });
                }
            } else {
                const result = await generateContent({ prompt: slide.title, contentType: contentType });
                if (result.generatedText) {
                    setSlides(prevSlides => prevSlides.map(s => s.id === slideId ? { ...s, [contentType]: result.generatedText } : s));
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Manage Hero Banner</h1>
        <p className="text-muted-foreground">Update the rotating slides on the homepage hero section.</p>
      </div>
      <div className="grid gap-6">
        {slides.map((slide) => (
            <Card key={slide.id}>
                <CardHeader>
                    <CardTitle>Edit Slide: {slide.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`title-${slide.id}`}>Title</Label>
                            <div className="flex gap-2">
                                <Input id={`title-${slide.id}`} name="title" value={slide.title} onChange={(e) => handleInputChange(e, slide.id)} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent(slide.id, 'title')} disabled={generating[`${slide.id}-title`]}>
                                    {generating[`${slide.id}-title`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`description-${slide.id}`}>Description</Label>
                             <div className="flex gap-2">
                                <Textarea id={`description-${slide.id}`} name="description" value={slide.description} onChange={(e) => handleInputChange(e, slide.id)} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent(slide.id, 'description')} disabled={generating[`${slide.id}-description`]}>
                                     {generating[`${slide.id}-description`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`buttonText-${slide.id}`}>Button Text</Label>
                             <div className="flex gap-2">
                                <Input id={`buttonText-${slide.id}`} name="buttonText" value={slide.buttonText} onChange={(e) => handleInputChange(e, slide.id)} />
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
