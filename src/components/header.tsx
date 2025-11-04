'use client';

import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import BANTLogo from '@/components/bant-logo';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';

const navLinks = [
  { href: '#products', label: 'Products' },
  { href: '#vendors', label: 'Vendors' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#about-us', label: 'About Us' },
  { href: '/admin', label: 'Admin' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const authLinks = user ? (
    <>
      <Button variant="ghost" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button asChild variant="ghost">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-secondary/50">
        <div className="container flex h-10 items-center justify-end gap-6 text-sm font-medium">
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Become a Vendor
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="#inquiry-section" className="text-muted-foreground transition-colors hover:text-foreground">
            Post Enquiry
          </Link>
        </div>
      </div>
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BANTLogo textClassName="text-xl md:text-2xl" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {!isUserLoading && authLinks}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={cn(
            'md:hidden animate-in fade-in-20 slide-in-from-top-4',
            'absolute top-[104px] left-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t'
          )}
        >
          <nav className="grid items-start gap-6 p-6 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Separator />
            <div className="flex flex-col gap-4">
              {!isUserLoading && authLinks}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
