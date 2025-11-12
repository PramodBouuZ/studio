'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function BecomeAVendorPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactName, setContactName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [products, setProducts] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
        toast({ variant: 'destructive', title: 'Firebase not initialized', description: 'Please try again later.' });
        return;
    }
    setLoading(true);
    
    // In a real application, you would upload the logo to Firebase Storage
    // and get the download URL. For now, we'll just proceed with user creation.
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in 'users' collection with role 'vendor'
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        firstName: contactName.split(' ')[0] || '',
        lastName: contactName.split(' ').slice(1).join(' ') || '',
        mobileNumber: mobileNumber,
        companyName: companyName,
        location: location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'vendor',
      });
      
      // Create a vendor profile in 'vendors' collection
      await setDoc(doc(firestore, 'vendors', user.uid), {
        id: user.uid,
        name: companyName,
        contactName: contactName,
        email: email,
        phone: mobileNumber,
        location: location,
        products: products,
        // logoUrl: "URL from Firebase Storage would go here"
        logoUrl: logoPreview || '',
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
      });

      // TODO: Implement real email sending service here
      console.log(`
        --- SIMULATING EMAIL ---
        To: ${email}
        Subject: Welcome, Vendor! Your BANTConfirm Application is Under Review.
        Body: Thank you for registering as a vendor. Your application is now pending approval. We'll notify you once it's been reviewed.
        -------------------------
      `);
      console.log(`
        --- SIMULATING EMAIL ---
        To: admin@bantconfirm.com
        Subject: New Vendor Application!
        Body: A new vendor, ${companyName}, has applied to join the marketplace. Please review their profile in the admin panel.
        -------------------------
      `);


      toast({ title: 'Registration Successful', description: 'Your vendor application has been submitted for review.' });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-104px)] items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-12">
      <Card className="mx-auto max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-xl">Become a Vendor</CardTitle>
          <CardDescription>Fill out the form below to join our marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" placeholder="Your Company Inc." required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contact-name">Contact Name</Label>
                        <Input id="contact-name" placeholder="John Doe" required value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="vendor@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="aspect-video rounded-md border border-dashed flex items-center justify-center relative overflow-hidden bg-muted/20">
                        {logoPreview ? (
                            <Image src={logoPreview} alt="Logo preview" fill className="object-contain p-4" />
                        ) : (
                            <div className="text-center text-muted-foreground space-y-1">
                                <ImageIcon className="mx-auto h-8 w-8" />
                                <p>Upload Logo</p>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Choose File
                            </label>
                        </Button>
                        <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                    </div>
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="mobile-number">Mobile Number</Label>
                    <Input id="mobile-number" type="tel" placeholder="9876543210" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, State" required value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="products">Products/Services Offered</Label>
              <Textarea id="products" placeholder="Describe the products or services you offer..." required value={products} onChange={(e) => setProducts(e.target.value)} rows={4} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Application'}
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
