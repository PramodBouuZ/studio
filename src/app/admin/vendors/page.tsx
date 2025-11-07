'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ImageIcon, Upload, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { VendorProfile } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getVendors } from '@/app/admin/vendors/actions';

export default function VendorsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [vendors, setVendors] = useState<VendorProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            const serverVendors = await getVendors();
            setVendors(serverVendors);
            setIsLoading(false);
        };
        fetchVendors();
    }, []);
    
    // This will re-run the fetch when a vendor is updated/deleted client-side
    const refetchVendors = async () => {
        const serverVendors = await getVendors();
        setVendors(serverVendors);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, vendorId: string) => {
        const file = e.target.files?.[0];
        if (file && firestore) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const imageUrl = event.target?.result as string;
                const vendorRef = doc(firestore, 'vendors', vendorId);
                await updateDoc(vendorRef, { logoUrl: imageUrl });
                toast({ title: 'Logo Updated!' });
                await refetchVendors();
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, vendorId: string) => {
        if (!firestore) return;
        const { name, value } = e.target;
        const vendorRef = doc(firestore, 'vendors', vendorId);
        await updateDoc(vendorRef, { [name]: value });
        // No need to toast here, onBlur is enough
    };

    const handleStatusChange = async (vendorId: string, status: 'approved' | 'rejected') => {
        if (!firestore) return;
        const vendorRef = doc(firestore, 'vendors', vendorId);
        await updateDoc(vendorRef, { status: status });
        toast({
            title: `Vendor ${status}`,
            description: `The vendor has been ${status}.`,
        });
        await refetchVendors();
    };

    const handleDeleteVendor = async (vendorId: string) => {
        if (!firestore) return;
        await deleteDoc(doc(firestore, 'vendors', vendorId));
        toast({
            title: 'Vendor Deleted',
            description: 'The vendor has been removed from the system.',
            variant: 'destructive',
        });
        await refetchVendors();
    }

    const sortedVendors = useMemo(() => {
      if (!vendors) return [];
      return [...vendors].sort((a, b) => {
        if (a.status === 'pending_approval' && b.status !== 'pending_approval') return -1;
        if (a.status !== 'pending_approval' && b.status === 'pending_approval') return 1;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }, [vendors]);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Vendors</h1>
            <p className="text-muted-foreground">Approve, edit, or remove vendors from your marketplace.</p>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="aspect-video w-full rounded-md" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                </CardContent>
                 <CardFooter className="flex justify-end gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                </CardFooter>
            </Card>
        ))}
        {!isLoading && sortedVendors.map((vendor) => (
            <Card key={vendor.id} className="flex flex-col">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>{vendor.name}</CardTitle>
                        <CardDescription>Status: 
                            <Badge variant={vendor.status === 'approved' ? 'default' : vendor.status === 'pending_approval' ? 'secondary' : 'destructive'} className="ml-2 capitalize">
                                {vendor.status.replace('_', ' ')}
                            </Badge>
                        </CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => handleDeleteVendor(vendor.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden bg-muted/20">
                            {vendor.logoUrl ? (
                                <Image src={vendor.logoUrl} alt={vendor.name} fill className="object-contain p-4" />
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
                                    Change Logo
                                </label>
                            </Button>
                            <input id={`upload-${vendor.id}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, vendor.id)} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`name-${vendor.id}`}>Company Name</Label>
                        <Input id={`name-${vendor.id}`} name="name" defaultValue={vendor.name} onBlur={(e) => handleInputChange(e, vendor.id)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`contactName-${vendor.id}`}>Contact Name</Label>
                        <Input id={`contactName-${vendor.id}`} name="contactName" defaultValue={vendor.contactName} onBlur={(e) => handleInputChange(e, vendor.id)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`email-${vendor.id}`}>Email</Label>
                        <Input id={`email-${vendor.id}`} name="email" defaultValue={vendor.email} onBlur={(e) => handleInputChange(e, vendor.id)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`products-${vendor.id}`}>Products/Services</Label>
                        <Textarea id={`products-${vendor.id}`} name="products" defaultValue={vendor.products} onBlur={(e) => handleInputChange(e, vendor.id)} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {vendor.status !== 'approved' && (
                        <Button onClick={() => handleStatusChange(vendor.id, 'approved')} size="sm">
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    )}
                     {vendor.status !== 'rejected' && (
                        <Button onClick={() => handleStatusChange(vendor.id, 'rejected')} variant="destructive" size="sm">
                            <X className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                    )}
                </CardFooter>
            </Card>
        ))}
        {!isLoading && vendors?.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
                <p>No vendors have registered yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
