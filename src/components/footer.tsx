import Link from 'next/link';
import BANTLogo from './bant-logo';
import { Github, Twitter, Linkedin } from 'lucide-react';
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
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Products</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Vendors</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link></li>
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Press</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
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
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BANTConfirm Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
