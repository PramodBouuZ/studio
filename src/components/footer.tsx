'use client';

import Link from 'next/link';
import BANTLogo from './bant-logo';
import { Github, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <Link href="/">
              <BANTLogo />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              BANTConfirm simplifies procurement by connecting businesses with top-tier vendors through an AI-powered BANT framework.
            </p>
             <div className="flex space-x-2 mt-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub"><Github className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="#vendors" className="text-sm text-muted-foreground hover:text-primary transition-colors">Vendors</Link></li>
              <li><Link href="#testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#about-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
               <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
                <li className='flex items-center gap-3'>
                    <Phone className='h-4 w-4 shrink-0 text-primary' />
                    <a href="tel:9310269821" className='hover:text-primary transition-colors'>9310269821</a>
                </li>
                <li className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 shrink-0 text-primary' />
                    <a href="mailto:Info@bantconfirm.com" className='hover:text-primary transition-colors'>Info@bantconfirm.com</a>
                </li>
                 <li className='flex items-start gap-3'>
                    <MapPin className='h-4 w-4 shrink-0 mt-1 text-primary' />
                    <span>Noida, Uttar Pradesh 201301</span>
                </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BANTConfirm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
