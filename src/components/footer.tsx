'use client';

import Link from 'next/link';
import BANTLogo from './bant-logo';
import { Github, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/">
              <BANTLogo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting customers with the right vendors, effortlessly.
            </p>
             <div className="flex space-x-4 mt-4">
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
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="#products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link></li>
              <li><Link href="#vendors" className="text-sm text-muted-foreground hover:text-foreground">Vendors</Link></li>
              <li><Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link></li>
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#about-us" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Press</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
                <li className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 shrink-0' />
                    <a href="tel:9310269821" className='hover:text-foreground'>9310269821</a>
                </li>
                <li className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 shrink-0' />
                    <a href="mailto:Info@bantconfirm.com" className='hover:text-foreground'>Info@bantconfirm.com</a>
                </li>
                 <li className='flex items-start gap-2'>
                    <MapPin className='h-4 w-4 shrink-0 mt-1' />
                    <span>Noida, Uttar Pradesh 201301</span>
                </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BANTConfirm Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}