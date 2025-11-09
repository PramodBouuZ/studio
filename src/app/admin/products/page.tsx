'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImageIcon, Upload, Trash2, PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateContent } from '@/ai/flows/generate-content';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { products as initialProducts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import type { VendorProfile } from '@/lib/types';

export default function ProductsPage() {
    const firestore = useFirestore();
    const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const { data: products, isLoading: productsLoading } = useCollection<Product>(productsCollection);

    const vendorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'vendors') : null, [firestore]);
    const { data: vendors, isLoading: isVendorsLoading } = useCollection<VendorProfile>(vendorsCollection);

    const { toast } = useToast();
    const [generating, setGenerating] = useState<Record<string, boolean>>({});

    const getImageUrl = (imageId: string) => {
        return PlaceHolderImages.find(img => img.id === imageId)?.imageUrl || (imageId.startsWith('data:') ? imageId : '');
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        if (!firestore) return;
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const imageUrl = event.target?.result as string;
                const productRef = doc(firestore, 'products', productId);
                await setDoc(productRef, { imageId: imageUrl }, { merge: true });
                toast({ title: 'Image Uploaded' });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, productId: string) => {
        if (!firestore) return;
        const { name, value } = e.target;
        const productRef = doc(firestore, 'products', productId);
        await setDoc(productRef, { [name]: name === 'price' ? Number(value) : value }, { merge: true });
    }
    
    const handleTypeChange = async (value: string, productId: string) => {
        if (!firestore) return;
        const productRef = doc(firestore, 'products', productId);
        await setDoc(productRef, { type: value as Product['type'] }, { merge: true });
    }
    
    const handleVendorChange = async (vendorId: string, productId: string) => {
        if (!firestore) return;
        const productRef = doc(firestore, 'products', productId);
        await setDoc(productRef, { vendorId: vendorId }, { merge: true });
    }

    const handleSaveChanges = (productId: string) => {
        const product = products?.find(p => p.id === productId);
        toast({
            title: 'Product Saved',
            description: `Changes to "${product?.name}" have been saved.`,
        });
    };
    
    const handleAddProduct = async () => {
        if (!firestore) return;
        const newId = `prod_${Date.now()}`;
        const newProduct: Product = {
            id: newId,
            name: 'New Product',
            description: 'A brief description of the new product.',
            price: 0,
            type: 'Software',
            imageId: '',
            iconName: 'ShoppingCart',
            vendorId: '',
        };
        await setDoc(doc(firestore, 'products', newId), newProduct);
        toast({
            title: 'Product Added',
            description: 'A new product has been added.',
        });
    }

    const handleDeleteProduct = async (productId: string) => {
        if (!firestore) return;
        await deleteDoc(doc(firestore, 'products', productId));
        toast({
            title: 'Product Deleted',
            description: 'The product has been removed.',
            variant: 'destructive',
        });
    }

    const handleGenerateContent = async (productId: string, contentType: 'productName' | 'description' | 'image') => {
        if (!firestore) return;
        const product = products?.find(p => p.id === productId);
        if (!product) return;
    
        const fieldKey = `${productId}-${contentType}`;
        setGenerating(prev => ({...prev, [fieldKey]: true}));
    
        try {
            const productRef = doc(firestore, 'products', productId);
            if (contentType === 'image') {
                const result = await generateContent({ prompt: product.name, generateImage: true });
                if (result.imageUrl) {
                    await setDoc(productRef, { imageId: result.imageUrl }, { merge: true });
                    toast({ title: 'AI Image Generated!', description: 'The image has been updated.' });
                }
            } else {
                const result = await generateContent({ prompt: product.name, contentType: contentType });
                const contentKey = contentType === 'productName' ? 'name' : 'description';
                if (result.generatedText) {
                    await setDoc(productRef, { [contentKey]: result.generatedText }, { merge: true });
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
    
    // Function to seed initial data if the collection is empty
    const seedInitialData = async () => {
        if (!firestore) return;
        const batch = writeBatch(firestore);
        initialProducts.forEach(product => {
            const docRef = doc(firestore, "products", product.id);
            batch.set(docRef, product);
        });
        await batch.commit();
        toast({ title: 'Initial products seeded!' });
    };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Products</h1>
            <p className="text-muted-foreground">Add, edit, or remove products from the catalog.</p>
        </div>
        <div className="flex gap-2">
            {!productsLoading && products?.length === 0 && (
                <Button onClick={seedInitialData} variant="outline">Seed Initial Products</Button>
            )}
            <Button onClick={handleAddProduct}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add Product
            </Button>
        </div>
      </div>
      <div className="grid gap-6">
        {productsLoading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-96 w-full"/>)}
        {products?.map((product) => (
            <Card key={product.id}>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Edit: {product.name}</CardTitle>
                        <CardDescription>Update the details for this product.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`name-${product.id}`}>Name</Label>
                            <div className="flex gap-2">
                                <Input id={`name-${product.id}`} name="name" defaultValue={product.name} onBlur={(e) => handleInputChange(e, product.id)} />
                                <Button variant="outline" size="icon" onClick={() => handleGenerateContent(product.id, 'productName')} disabled={generating[`${product.id}-productName`]}>
                                    {generating[`${product.id}-productName`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`description-${product.id}`}>Description</Label>
                            <div className="flex gap-2">
                                <Textarea id={`description-${product.id}`} name="description" defaultValue={product.description} onBlur={(e) => handleInputChange(e, product.id)} />
                                 <Button variant="outline" size="icon" onClick={() => handleGenerateContent(product.id, 'description')} disabled={generating[`${product.id}-description`]}>
                                    {generating[`${product.id}-description`] ? <Loader2 className="animate-spin" /> : <Sparkles className="text-accent" />}
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`price-${product.id}`}>Price (₹)</Label>
                                <Input id={`price-${product.id}`} name="price" type="number" defaultValue={product.price} onBlur={(e) => handleInputChange(e, product.id)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`type-${product.id}`}>Type</Label>
                                 <Select defaultValue={product.type} onValueChange={(v) => handleTypeChange(v, product.id)}>
                                    <SelectTrigger id={`type-${product.id}`}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Software">Software</SelectItem>
                                        <SelectItem value="Service">Service</SelectItem>
                                        <SelectItem value="Consulting">Consulting</SelectItem>
                                        <SelectItem value="Hardware">Hardware</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                                <Label htmlFor={`vendor-${product.id}`}>Vendor</Label>
                                {isVendorsLoading ? <Skeleton className="h-10 w-full" /> : (
                                    <Select defaultValue={product.vendorId} onValueChange={(v) => handleVendorChange(v, product.id)}>
                                        <SelectTrigger id={`vendor-${product.id}`}>
                                            <SelectValue placeholder="Select vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vendors?.map(vendor => (
                                                <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden">
                            {getImageUrl(product.imageId) ? (
                                <Image src={getImageUrl(product.imageId)} alt={product.name} fill className="object-cover" />
                            ) : (
                                <div className="text-center text-muted-foreground space-y-1">
                                    <ImageIcon className="mx-auto h-8 w-8" />
                                    <p>No image</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor={`upload-${product.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </label>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => handleGenerateContent(product.id, 'image')} disabled={generating[`${product.id}-image`]}>
                                {generating[`${product.id}-image`] ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 text-accent" />}
                                Generate with AI
                            </Button>
                            <input id={`upload-${product.id}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, product.id)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSaveChanges(product.id)}>Save Changes</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
