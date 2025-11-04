import type { LucideIcon } from 'lucide-react';
import { Briefcase, Lightbulb, ShoppingCart, Wrench, Megaphone, Server, Palette, CloudCog } from 'lucide-react';

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
    name: 'Unified Communications Platform',
    type: 'Software',
    price: 80000,
    description: 'Integrate voice, video, and messaging for seamless team collaboration.',
    imageId: 'product-1',
    icon: ShoppingCart,
  },
  {
    id: 'prod_2',
    name: 'VoIP Business Phone System',
    type: 'Service',
    price: 50000,
    description: 'Cost-effective, feature-rich voice over IP solutions for modern businesses.',
    imageId: 'product-2',
    icon: Wrench,
  },
  {
    id: 'prod_3',
    name: 'Cloud Contact Center',
    type: 'Service',
    price: 150000,
    description: 'Scalable and intelligent contact center solutions to enhance customer experience.',
    imageId: 'product-5',
    icon: CloudCog,
  },
  {
    id: 'prod_4',
    name: 'Telecom Expense Management',
    type: 'Consulting',
    price: 100000,
    description: 'Optimize your telecom spend with our expert analysis and management services.',
    imageId: 'product-4',
    icon: Briefcase,
  },
  {
    id: 'prod_5',
    name: 'Enterprise PBX Server',
    type: 'Hardware',
    price: 250000,
    description: 'Robust and secure on-premise PBX servers for large-scale operations.',
    imageId: 'product-3',
    icon: Server,
  },
  {
    id: 'prod_6',
    name: 'SIP Trunking Services',
    type: 'Service',
    price: 30000,
    description: 'Reliable and high-quality SIP trunking to connect your PBX to the PSTN.',
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
