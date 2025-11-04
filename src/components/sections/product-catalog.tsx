'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { products as allProducts, type Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const productTypes = ['All', 'Software', 'Service', 'Consulting', 'Hardware'];
const maxPrice = Math.max(...allProducts.map((p) => p.price));

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || product.type === selectedType;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchTerm, selectedType, priceRange]);

  return (
    <section id="products" className="py-16 sm:py-24">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Our Product Catalog</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed">
          Explore a wide range of products and services offered by our trusted vendors.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-4 bg-card rounded-lg border">
        <div className="md:col-span-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="type">Product Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Price Range</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">${priceRange[0]}</span>
            <Slider
              min={0}
              max={maxPrice}
              step={100}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
              className="w-full"
            />
            <span className="text-sm font-medium">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
         {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No products match your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
  const Icon = product.icon;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        {image && (
          <div className="relative h-48 w-full">
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold font-headline">{product.name}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            {product.type}
          </Badge>
        </div>
        <CardDescription className="mb-4 h-10">{product.description}</CardDescription>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold text-primary">
            ${product.price.toLocaleString()}
          </p>
          <Button variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
    return <label htmlFor={htmlFor} className="block text-sm font-medium text-muted-foreground mb-2">{children}</label>
}