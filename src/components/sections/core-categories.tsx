'use client';

import { Input } from '@/components/ui/input';
import { Mic } from 'lucide-react';

export default function CoreCategories() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-4">
          Explore Our Core Categories
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed mb-8">
          Find the perfect solution for your business needs.
        </p>
        <div className="max-w-2xl mx-auto relative">
          <Input
            type="search"
            placeholder="Search for products or features (e.g., 'CRM')"
            className="w-full h-12 text-base rounded-full pl-6 pr-14"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground h-9 w-9 rounded-full flex items-center justify-center">
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}