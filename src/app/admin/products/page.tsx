'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImageIcon, Upload, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { products as initialProducts, type Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const { toast } = useToast();

    const getImageUrl = (imageId: string) => {
        return PlaceHolderImages.find(img => img.id === imageId)?.imageUrl || '';
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                // In a real app, you would upload this file and get a URL.
                // For now, we just update the UI with a local data URL.
                const tempImageId = `temp-product-${productId}-${Date.now()}`;
                PlaceHolderImages.push({
                    id: tempImageId,
                    description: 'Uploaded product image',
                    imageUrl: imageUrl,
                    imageHint: 'custom product'
                });
                setProducts(products.map(p => p.id === productId ? {...p, imageId: tempImageId} : p));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, productId: string) => {
        const { name, value } = e.target;
        setProducts(products.map(p => p.id === productId ? {...p, [name]: name === 'price' ? Number(value) : value } : p));
    }
    
    const handleTypeChange = (value: string, productId: string) => {
        setProducts(products.map(p => p.id === productId ? {...p, type: value as Product['type'] } : p));
    }

    const handleSaveChanges = (productId: string) => {
        const product = products.find(p => p.id === productId);
        toast({
            title: 'Product Saved',
            description: `Changes to "${product?.name}" have been saved.`,
        });
    };
    
    const handleAddProduct = () => {
        const newId = `prod_${Date.now()}`;
        const newProduct: Product = {
            id: newId,
            name: 'New Product',
            description: 'A brief description of the new product.',
            price: 0,
            type: 'Software',
            imageId: '',
            icon: PlusCircle,
        };
        setProducts([newProduct, ...products]);
        toast({
            title: 'Product Added',
            description: 'A new product has been added to the top of the list.',
        });
    }

    const handleDeleteProduct = (productId: string) => {
        setProducts(products.filter(p => p.id !== productId));
        toast({
            title: 'Product Deleted',
            description: 'The product has been removed.',
            variant: 'destructive',
        });
    }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Products</h1>
            <p className="text-muted-foreground">Add, edit, or remove products from the catalog.</p>
        </div>
        <Button onClick={handleAddProduct}>
            <PlusCircle className="mr-2 h-4 w-4"/>
            Add Product
        </Button>
      </div>
      <div className="grid gap-6">
        {products.map((product) => (
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
                            <Input id={`name-${product.id}`} name="name" value={product.name} onChange={(e) => handleInputChange(e, product.id)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`description-${product.id}`}>Description</Label>
                            <Textarea id={`description-${product.id}`} name="description" value={product.description} onChange={(e) => handleInputChange(e, product.id)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`price-${product.id}`}>Price (₹)</Label>
                                <Input id={`price-${product.id}`} name="price" type="number" value={product.price} onChange={(e) => handleInputChange(e, product.id)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`type-${product.id}`}>Type</Label>
                                 <Select value={product.type} onValueChange={(v) => handleTypeChange(v, product.id)}>
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
                        <div className="relative">
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor={`upload-${product.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </label>
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
