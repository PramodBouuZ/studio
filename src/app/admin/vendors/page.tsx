'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ImageIcon, Upload, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { vendors as initialVendors, type Vendor } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
    const { toast } = useToast();

    const getImageUrl = (imageId: string) => {
        return PlaceHolderImages.find(img => img.id === imageId)?.imageUrl || '';
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, vendorId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                const tempImageId = `temp-vendor-${vendorId}-${Date.now()}`;
                PlaceHolderImages.push({
                    id: tempImageId,
                    description: 'Uploaded vendor logo',
                    imageUrl: imageUrl,
                    imageHint: 'custom logo'
                });
                setVendors(vendors.map(v => v.id === vendorId ? {...v, imageId: tempImageId} : v));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, vendorId: string) => {
        setVendors(vendors.map(v => v.id === vendorId ? {...v, [e.target.name]: e.target.value} : v));
    }

    const handleSaveChanges = (vendorId: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        toast({
            title: 'Vendor Saved',
            description: `Changes to "${vendor?.name}" have been saved.`,
        });
    };

    const handleAddVendor = () => {
        const newId = `vendor_${Date.now()}`;
        const newVendor: Vendor = {
            id: newId,
            name: 'New Vendor',
            imageId: '',
        };
        setVendors([newVendor, ...vendors]);
        toast({
            title: 'Vendor Added',
            description: 'A new vendor has been added to the top of the list.',
        });
    }

    const handleDeleteVendor = (vendorId: string) => {
        setVendors(vendors.filter(v => v.id !== vendorId));
        toast({
            title: 'Vendor Deleted',
            description: 'The vendor has been removed.',
            variant: 'destructive',
        });
    }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Vendors</h1>
            <p className="text-muted-foreground">Update the vendor logos displayed on the homepage.</p>
        </div>
         <Button onClick={handleAddVendor}>
            <PlusCircle className="mr-2 h-4 w-4"/>
            Add Vendor
        </Button>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
            <Card key={vendor.id}>
                <CardHeader className="flex flex-row justify-between items-start">
                    <CardTitle>Edit: {vendor.name}</CardTitle>
                     <Button variant="ghost" size="icon" onClick={() => handleDeleteVendor(vendor.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`name-${vendor.id}`}>Vendor Name</Label>
                        <Input id={`name-${vendor.id}`} name="name" value={vendor.name} onChange={(e) => handleInputChange(e, vendor.id)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden bg-muted/20">
                            {getImageUrl(vendor.imageId) ? (
                                <Image src={getImageUrl(vendor.imageId)} alt={vendor.name} fill className="object-contain p-4" />
                            ) : (
                                <div className="text-center text-muted-foreground space-y-1">
                                    <ImageIcon className="mx-auto h-8 w-8" />
                                    <p>No logo</p>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor={`upload-${vendor.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Logo
                                </label>
                            </Button>
                            <input id={`upload-${vendor.id}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, vendor.id)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleSaveChanges(vendor.id)} className="w-full">Save Changes</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
