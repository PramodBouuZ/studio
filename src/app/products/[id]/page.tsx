

'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, setDoc } from 'firebase/firestore';
import { type Product } from '@/lib/data';
import type { VendorProfile } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CloudCog, Lightbulb, Server, ShoppingCart, Wrench, ArrowRight, MapPin, Building, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Lead } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const icons: { [key: string]: React.ElementType } = {
    Briefcase, ShoppingCart, Wrench, CloudCog, Server, Lightbulb,
};

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const router = useRouter();

    const firestore = useFirestore();
    const { user } = useUser();

    const productDocRef = useMemoFirebase(() => firestore && id ? doc(firestore, 'products', id) : null, [firestore, id]);
    const { data: product, isLoading: isProductLoading } = useDoc<Product>(productDocRef);
    
    const vendorDocRef = useMemoFirebase(() => firestore && product?.vendorId ? doc(firestore, 'vendors', product.vendorId) : null, [firestore, product?.vendorId]);
    const { data: vendor, isLoading: isVendorLoading } = useDoc<VendorProfile>(vendorDocRef);

    const Icon = product ? icons[product.iconName as keyof typeof icons] || ShoppingCart : ShoppingCart;
    const image = product ? PlaceHolderImages.find((img) => img.id === product.imageId) || { imageUrl: product.imageId.startsWith('data:') ? product.imageId : '', description: product.name, imageHint: '' } : null;
    const vendorImage = vendor ? PlaceHolderImages.find((img) => img.id === vendor.logoUrl) || { imageUrl: vendor.logoUrl.startsWith('data:') ? vendor.logoUrl : '', description: vendor.name, imageHint: '' } : null;

    const handlePostEnquiry = async () => {
        if (!user || !firestore || !product) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in or sign up to post an enquiry.',
                action: <Button onClick={() => router.push('/login')}>Login</Button>,
            });
            return;
        }

        const leadRef = doc(collection(firestore, 'leads'));
        const newLead: Lead = {
            id: leadRef.id,
            name: user.displayName || user.email || 'Anonymous',
            company: '', // Could be fetched from user profile
            email: user.email || '',
            phone: user.phoneNumber || '',
            inquiry: `Interested in: ${product.name} (ID: ${product.id})`,
            status: 'New',
            assignedVendor: vendor?.name || '',
        };

        await setDoc(leadRef, newLead);

        // TODO: Implement real email sending service here
        console.log(`
            --- SIMULATING EMAIL ---
            To: ${newLead.email}
            Subject: Your BANTConfirm Inquiry for ${product.name}
            Body: Thank you for your inquiry about ${product.name}. The vendor, ${vendor?.name || 'BANTConfirm'}, will be in touch with you shortly.
            -------------------------
        `);
        console.log(`
            --- SIMULATING EMAIL ---
            To: admin@bantconfirm.com
            Subject: New Inquiry for ${product.name}
            Body: A new lead has been submitted by ${newLead.name} for the product ${product.name}. Vendor: ${vendor?.name || 'Unassigned'}.
            -------------------------
        `);
        if (vendor?.email) {
            console.log(`
                --- SIMULATING EMAIL ---
                To: ${vendor.email}
                Subject: New Lead for ${product.name}!
                Body: You have a new lead from ${newLead.name} for your product: ${product.name}. Please follow up.
                -------------------------
            `);
        }

        toast({
            title: 'Enquiry Sent!',
            description: `Your interest in "${product.name}" has been sent to ${vendor?.name}. They will reach out to you shortly.`,
        });
    };

    if (isProductLoading || (product && isVendorLoading)) {
        return <ProductDetailSkeleton />;
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold">Product not found</h1>
                <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
                <Button onClick={() => router.push('/')} className="mt-6">Go back to homepage</Button>
            </div>
        )
    }

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": image?.imageUrl,
        "description": product.description,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": vendor?.name || "BANTConfirm Vendor"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.bantconfirm.com/products/${product.id}`,
          "priceCurrency": "INR",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": vendor?.name || "BANTConfirm Vendor"
          }
        }
      };


    return (
        <>
        <Script id="product-schema" type="application/ld+json">
            {JSON.stringify(productSchema)}
        </Script>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-lg">
                        {image ? (
                            <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} />
                        ) : (
                            <div className="bg-muted h-full w-full"></div>
                        )}
                         <Badge variant="outline" className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm">
                            <Icon className="h-4 w-4 text-primary" />
                            {product.type}
                        </Badge>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline">{product.name}</h1>
                        <p className="text-lg text-muted-foreground">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                         <p className="text-4xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
                         <Badge variant="secondary">One-time Price</Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="w-full" onClick={handlePostEnquiry}>
                            Post Enquiry <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="w-full">Book a Demo</Button>
                    </div>
                    
                    <div className="border-t pt-6">
                         {isVendorLoading && <VendorInfoSkeleton />}
                         {vendor && (
                            <Card className="bg-secondary/50">
                                <CardHeader className="flex-row gap-4 items-center">
                                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border bg-background">
                                         {vendorImage ? (
                                            <Image src={vendorImage.imageUrl} alt={vendor.name} fill className="object-contain p-2" data-ai-hint={vendorImage.imageHint} />
                                        ) : (
                                            <div className="bg-muted h-full w-full flex items-center justify-center">
                                                <Building className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Sold by {vendor.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <MapPin className="h-4 w-4" /> 
                                            <span>{vendor.location}</span>
                                            <span className="text-muted-foreground/50">|</span>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span className="font-bold text-foreground">4.8</span>
                                                <span className="text-muted-foreground">(120 Reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                         )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-12 w-48" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="border-t pt-6">
                        <VendorInfoSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}

function VendorInfoSkeleton() {
    return (
        <Card className="bg-secondary/50">
            <CardHeader className="flex-row gap-4 items-center">
                <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
            </CardHeader>
        </Card>
    )
}
