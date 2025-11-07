
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Lightbulb, ShoppingCart, Wrench, Megaphone, Server, Palette, CloudCog } from 'lucide-react';
import type { VendorProfile } from './types';

export type Product = {
  id: string;
  name: string;
  type: 'Software' | 'Service' | 'Consulting' | 'Hardware';
  price: number;
  description: string;
  imageId: string;
  iconName: string; // Changed from icon to iconName
  keywords?: string[];
};

// This is now seed data, not the source of truth.
export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Unified Communications Platform',
    type: 'Software',
    price: 80000,
    description: 'Integrate voice, video, and messaging for seamless team collaboration.',
    imageId: 'product-1',
    iconName: 'ShoppingCart',
    keywords: ['UC', 'collaboration', 'messaging', 'video conference'],
  },
  {
    id: 'prod_2',
    name: 'VoIP Business Phone System',
    type: 'Service',
    price: 50000,
    description: 'Cost-effective, feature-rich voice over IP solutions for modern businesses.',
    imageId: 'product-2',
    iconName: 'Wrench',
    keywords: ['voip', 'phone system', 'business communication', 'telephony'],
  },
  {
    id: 'prod_3',
    name: 'Cloud Contact Center',
    type: 'Service',
    price: 150000,
    description: 'Scalable and intelligent contact center solutions to enhance customer experience.',
    imageId: 'product-5',
    iconName: 'CloudCog',
    keywords: ['contact center', 'customer support', 'cloud', 'CX'],
  },
  {
    id: 'prod_4',
    name: 'Telecom Expense Management',
    type: 'Consulting',
    price: 100000,
    description: 'Optimize your telecom spend with our expert analysis and management services.',
    imageId: 'product-4',
    iconName: 'Briefcase',
    keywords: ['telecom', 'expense management', 'cost optimization', 'auditing'],
  },
  {
    id: 'prod_5',
    name: 'Enterprise PBX Server',
    type: 'Hardware',
    price: 250000,
    description: 'Robust and secure on-premise PBX servers for large-scale operations.',
    imageId: 'product-3',
    iconName: 'Server',
    keywords: ['pbx', 'server', 'on-premise', 'enterprise phone system'],
  },
  {
    id: 'prod_6',
    name: 'SIP Trunking Services',
    type: 'Service',
    price: 30000,
    description: 'Reliable and high-quality SIP trunking to connect your PBX to the PSTN.',
    imageId: 'product-6',
    iconName: 'Wrench',
    keywords: ['sip trunking', 'telephony', 'connectivity', 'pstn'],
  },
];


export type Vendor = {
  id: string;
  name: string;
  imageId: string;
};

export const vendors: Vendor[] = [
    { id: 'vendor_1', name: 'Airtel', imageId: 'vendor-airtel' },
    { id: 'vendor_2', name: 'Tata Communications', imageId: 'vendor-tata' },
    { id: 'vendor_3', name: 'Jio', imageId: 'vendor-jio' },
    { id: 'vendor_4', name: 'Vodafone Idea', imageId: 'vendor-vi' },
    { id: 'vendor_5', name: 'BSNL', imageId: 'vendor-bsnl' },
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
    name: 'Rohan Sharma',
    role: 'IT Head, Global Exports',
    quote: 'BANTConfirm helped us find the perfect VoIP provider in record time. The AI-driven process ensured we got a vendor that met our exact budget and technical needs.',
    imageId: 'avatar-1',
  },
  {
    id: 'test_2',
    name: 'Priya Mehta',
    role: 'Operations Director, Sterling Corp',
    quote: 'The marketplace is incredibly intuitive. We submitted our requirements and received proposals from top-tier telecom companies within a day. A fantastic experience!',
    imageId: 'avatar-2',
  },
  {
    id: 'test_3',
    name: 'Ankit Desai',
    role: 'Founder, NextGen BPO',
    quote: 'As a startup, every penny counts. BANTConfirm connected us with a vendor that provided a scalable and affordable cloud contact center solution, which was crucial for our growth.',
    imageId: 'avatar-3',
  },
  {
    id: 'test_4',
    name: 'Sameer Gupta',
    role: 'CFO, Pharma Solutions Ltd.',
    quote: 'The Telecom Expense Management consultant we found through this platform has already saved us 20% on our annual telecom bills. The quality of vendors is truly top-notch.',
    imageId: 'avatar-4',
  },
];

export type Lead = {
  id:string;
  name: string;
  company: string;
  email: string;
  phone: string;
  inquiry: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  assignedVendor: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageId: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageId: string;
  tagText: string;
};
