'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { type Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Calendar as CalendarIcon, Clock, Briefcase, ShoppingCart, Wrench, CloudCog, Server, Lightbulb } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useAIChat } from '../ai-chat';
import { type Lead } from '@/lib/data';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

const productTypes = ['All', 'Software', 'Service', 'Consulting', 'Hardware'];

const icons = {
    Briefcase,
    ShoppingCart,
    Wrench,
    CloudCog,
    Server,
    Lightbulb,
};

export default function ProductCatalog() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: allProducts, isLoading: productsLoading } = useCollection<Product>(productsCollection);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const maxPrice = useMemo(() => allProducts ? Math.max(...allProducts.map((p) => p.price)) : 100000, [allProducts]);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { highlightedProductIds } = useAIChat();

  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || product.type === selectedType;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchTerm, selectedType, priceRange, allProducts]);
  
  const handleBookDemoClick = (product: Product) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in or sign up to book a demo.',
        action: <Button onClick={() => router.push('/login')}>Login</Button>,
      });
      return;
    }
    setSelectedProduct(product);
    setDemoModalOpen(true);
  };
  
  const handlePostEnquiryClick = async (product: Product) => {
    if (!user || !firestore) {
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
      inquiry: `Interested in: ${product.name}`,
      status: 'New',
      assignedVendor: '',
    };

    await setDoc(leadRef, newLead);

    toast({
      title: 'Enquiry Sent!',
      description: `Your interest in "${product.name}" has been noted. Our team will reach out to you shortly.`,
    });
  };

  const handleScheduleDemo = () => {
    if (selectedDate && selectedTime && selectedProduct) {
      toast({
        title: 'Demo Booked!',
        description: `Your demo for ${selectedProduct.name} is scheduled on ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
      });
      setDemoModalOpen(false);
      setSelectedDate(new Date());
      setSelectedTime('');
    } else {
        toast({
            variant: 'destructive',
            title: 'Incomplete Information',
            description: 'Please select a date and time to book the demo.',
        })
    }
  };

  const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  return (
    <section id="products" className="py-16 sm:py-24 overflow-hidden">
      <motion.div 
        className="text-center space-y-4 mb-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl font-headline">Our Product Catalog</h2>
        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl/relaxed">
          Explore a wide range of curated products and services offered by our network of trusted vendors.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-12 p-6 bg-card/80 backdrop-blur-sm border shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-2">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                      id="search"
                      placeholder="Search by name or description..."
                      className="pl-10 h-11 text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
              <div>
                  <Label htmlFor="type">Product Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="type" className="h-11 text-base">
                          <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                      {productTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-3">
                  <div className="flex justify-between items-center">
                      <Label>Price Range</Label>
                      <span className="text-sm font-medium text-primary">
                          ₹{priceRange[0]} - ₹{priceRange[1]}
                      </span>
                  </div>
                  <Slider
                      min={0}
                      max={maxPrice}
                      step={100}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value)}
                      className="w-full"
                  />
              </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productsLoading && Array.from({length: 6}).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Skeleton className="h-[450px] w-full" />
            </motion.div>
        ))}
        {filteredProducts.map((product, index) => (
           <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard 
              product={product}
              onBookDemoClick={() => handleBookDemoClick(product)}
              onPostEnquiryClick={() => handlePostEnquiryClick(product)}
              isHighlighted={highlightedProductIds.includes(product.id)}
            />
          </motion.div>
        ))}
         {!productsLoading && filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-lg text-muted-foreground">No products match your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <Dialog open={isDemoModalOpen} onOpenChange={setDemoModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Book a Demo for {selectedProduct?.name}</DialogTitle>
                <DialogDescription>Select a date and time that works for you.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Time</Label>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                        {timeSlots.map(time => (
                            <Button key={time} variant={selectedTime === time ? 'default' : 'outline'} onClick={() => setSelectedTime(time)}>
                                <Clock className="mr-2 h-4 w-4" />
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleScheduleDemo}>Schedule Demo</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </section>
  );
}

function ProductCard({ product, onBookDemoClick, onPostEnquiryClick, isHighlighted }: { product: Product, onBookDemoClick: () => void, onPostEnquiryClick: () => void, isHighlighted?: boolean }) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId) || { imageUrl: product.imageId.startsWith('data:') ? product.imageId : '', description: product.name, imageHint: '' };
  const Icon = icons[product.iconName as keyof typeof icons] || ShoppingCart;

  return (
    <Card className={cn(
        "overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group h-full",
        isHighlighted ? "border-primary ring-2 ring-primary" : "border-transparent hover:border-primary"
    )}>
      <CardHeader className="p-0">
        {image && (
          <div className="relative h-52 w-full">
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={image.imageHint}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
             {isHighlighted && <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">Suggested</div>}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col bg-card">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold font-headline">{product.name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1.5 shrink-0 border-primary/50 text-primary">
            <Icon className="h-3.5 w-3.5" />
            {product.type}
          </Badge>
        </div>
        <CardDescription className="mb-4 flex-grow text-base">{product.description}</CardDescription>
        <div className="flex justify-between items-center mt-6">
          <p className="text-2xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onBookDemoClick}>Book Demo</Button>
            <Button size="sm" onClick={onPostEnquiryClick}>Post Enquiry</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode, className?: string }) {
    return <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-muted-foreground", className)}>{children}</label>
}
