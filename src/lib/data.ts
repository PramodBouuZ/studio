import type { LucideIcon } from 'lucide-react';
import { Briefcase, Lightbulb, ShoppingCart, Wrench } from 'lucide-react';

export type Product = {
  id: string;
  name: string;
  type: 'Software' | 'Service' | 'Consulting' | 'Hardware';
  price: number;
  description: string;
  imageId: string;
  icon: LucideIcon;
};

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'CRM Pro',
    type: 'Software',
    price: 499,
    description: 'Advanced customer relationship management software.',
    imageId: 'product-1',
    icon: ShoppingCart,
  },
  {
    id: 'prod_2',
    name: 'Digital Marketing Campaign',
    type: 'Service',
    price: 1200,
    description: 'Comprehensive digital marketing services.',
    imageId: 'product-2',
    icon: Wrench,
  },
  {
    id: 'prod_3',
    name: 'Cloud Infrastructure Setup',
    type: 'Service',
    price: 2500,
    description: 'Full setup of scalable cloud infrastructure.',
    imageId: 'product-5',
    icon: Wrench,
  },
  {
    id: 'prod_4',
    name: 'Business Strategy Consulting',
    type: 'Consulting',
    price: 5000,
    description: 'Expert consulting for business growth.',
    imageId: 'product-4',
    icon: Briefcase,
  },
  {
    id: 'prod_5',
    name: 'Quantum Server R2',
    type: 'Hardware',
    price: 15000,
    description: 'High-performance server for demanding applications.',
    imageId: 'product-3',
    icon: Lightbulb,
  },
  {
    id: 'prod_6',
    name: 'UI/UX Design Subscription',
    type: 'Service',
    price: 850,
    description: 'Monthly subscription for UI/UX design services.',
    imageId: 'product-6',
    icon: Wrench,
  },
];

export type Vendor = {
  id: string;
  name: string;
  imageId: string;
};

export const vendors: Vendor[] = [
  { id: 'vendor_1', name: 'Innovatech', imageId: 'vendor-1' },
  { id: 'vendor_2', name: 'MarketVantage', imageId: 'vendor-2' },
  { id: 'vendor_3', name: 'Stratgurus', imageId: 'vendor-3' },
  { id: 'vendor_4', name: 'QuantumCore', imageId: 'vendor-4' },
  { id: 'vendor_5', name: 'PixelPerfect', imageId: 'vendor-5' },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  imageId: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 'test_1',
    name: 'Sarah Johnson',
    role: 'CEO, TechCorp',
    quote: 'BANTConfirm transformed how we find vendors. The AI refinement is a game-changer, saving us countless hours.',
    imageId: 'avatar-1',
  },
  {
    id: 'test_2',
    name: 'David Chen',
    role: 'Marketing Director, Creative Solutions',
    quote: 'The quality of leads and the platform\'s ease of use are exceptional. We\'ve seen a 30% increase in qualified leads.',
    imageId: 'avatar-2',
  },
  {
    id: 'test_3',
    name: 'Maria Rodriguez',
    role: 'Founder, StartUpX',
    quote: 'As a new business, finding the right partners is crucial. BANTConfirm made it simple and efficient. Highly recommended!',
    imageId: 'avatar-3',
  },
  {
    id: 'test_4',
    name: 'James Williams',
    role: 'Operations Manager, Global Logistics',
    quote: 'The admin dashboard is powerful. Managing leads and gaining AI insights has streamlined our entire sales process.',
    imageId: 'avatar-4',
  },
];

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  inquiry: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  assignedVendor: string;
};

export const leads: Lead[] = [
  {
    id: 'lead_1',
    name: 'John Doe',
    company: 'Acme Inc.',
    email: 'john.doe@acme.com',
    phone: '555-1234',
    inquiry: 'Looking for a new CRM solution for our sales team of 50 people. Need integration with our existing email marketing platform.',
    status: 'New',
    assignedVendor: '',
  },
  {
    id: 'lead_2',
    name: 'Jane Smith',
    company: 'Innovate LLC',
    email: 'jane.s@innovate.llc',
    phone: '555-5678',
    inquiry: 'We need to redesign our company website and improve SEO.',
    status: 'Contacted',
    assignedVendor: 'PixelPerfect',
  },
  {
    id: 'lead_3',
    name: 'Robert Brown',
    company: 'Synergy Corp',
    email: 'r.brown@synergy.co',
    phone: '555-8765',
    inquiry: 'Seeking a business consultant to help us expand into the European market. Experience in logistics is a must.',
    status: 'Qualified',
    assignedVendor: 'Stratgurus',
  },
  {
    id: 'lead_4',
    name: 'Emily White',
    company: 'Tech Solutions',
    email: 'emily.w@techsolutions.net',
    phone: '555-4321',
    inquiry: 'We require a custom software development for an internal inventory management system.',
    status: 'New',
    assignedVendor: '',
  },
  {
    id: 'lead_5',
    name: 'Michael Green',
    company: 'GreenScape',
    email: 'm.green@greenscape.com',
    phone: '555-9988',
    inquiry: 'Interested in a long-term service contract for IT support and maintenance for our 100+ employees.',
    status: 'Closed',
    assignedVendor: 'Innovatech',
  },
];
