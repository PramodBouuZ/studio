'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImageIcon, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Promotion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
};

const initialPromotions: Promotion[] = [
    {
        id: 'promo-1',
        title: 'Cloud Telephony Systems',
        description: 'Upgrade your business communication with our reliable and scalable cloud phone systems.',
        imageUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NjIxNTIyODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        buttonText: 'Learn More',
    },
    {
        id: 'promo-2',
        title: 'Unlock Business Growth',
        description: 'Access a marketplace of services designed to scale your operations.',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGF0YSUyMGFuYWx5c2lzfGVufDB8fHx8MTc2MjE0NTczNnww&ixlib=rb-4.1.0&q=80&w=1080',
        buttonText: 'Explore Services',
    },
];

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, promoId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setPromotions(promotions.map(p => p.id === promoId ? {...p, imageUrl} : p));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, promoId: string) => {
        setPromotions(promotions.map(p => p.id === promoId ? {...p, [e.target.name]: e.target.value} : p));
    }

    const handleSaveChanges = (promoId: string) => {
        const promo = promotions.find(p => p.id === promoId);
        toast({
            title: 'Promotion Saved',
            description: `Changes to "${promo?.title}" have been saved.`,
        });
    };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Manage Promotions</h1>
        <p className="text-muted-foreground">Update the promotional banners displayed on the homepage.</p>
      </div>
      <div className="grid gap-6">
        {promotions.map((promo) => (
            <Card key={promo.id}>
                <CardHeader>
                    <CardTitle>Edit: {promo.title}</CardTitle>
                    <CardDescription>Update the content for this promotional slide.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`title-${promo.id}`}>Title</Label>
                            <Input id={`title-${promo.id}`} name="title" value={promo.title} onChange={(e) => handleInputChange(e, promo.id)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`description-${promo.id}`}>Description</Label>
                            <Textarea id={`description-${promo.id}`} name="description" value={promo.description} onChange={(e) => handleInputChange(e, promo.id)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`buttonText-${promo.id}`}>Button Text</Label>
                            <Input id={`buttonText-${promo.id}`} name="buttonText" value={promo.buttonText} onChange={(e) => handleInputChange(e, promo.id)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden">
                            {promo.imageUrl ? (
                                <Image src={promo.imageUrl} alt={promo.title} fill className="object-cover" />
                            ) : (
                                <div className="text-center text-muted-foreground space-y-1">
                                    <ImageIcon className="mx-auto h-8 w-8" />
                                    <p>No image</p>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor={`upload-${promo.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </label>
                            </Button>
                            <input id={`upload-${promo.id}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, promo.id)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSaveChanges(promo.id)}>Save Changes</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
