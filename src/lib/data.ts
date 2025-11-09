
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
  iconName: string; 
  keywords?: string[];
  vendorId: string;
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
    vendorId: 'vendor_1',
    keywords: [
        'UC', 
        'collaboration', 
        'messaging', 
        'video conference', 
        'IT software solutions in Delhi NCR', 
        'Software marketplace in Gurgaon', 
        'B2B IT vendors in Noida',
        'IT software solutions near me',
        'SaaS tools marketplace near me',
        'G2',
        'Capterra India',
        'SoftwareSuggest',
        'TechJockey',
        'Freshworks Marketplace',
        'IndiaMART',
        'BANTConfirm IT marketplace',
        'BANTConfirm software solutions',
        'IT & SaaS Solutions Keywords',
        'AI chatbot and voice agent software India',
        'Customer support automation solutions',
        'BANTConfirm Branded Keywords',
        'BANTConfirm B2B portal',
        'Post your business requirement BANTConfirm',
        'Verified vendors BANTConfirm India',
        'Local + “Near Me” Keywords',
        'B2B software vendors in Delhi',
        'Cloud software companies in Pune',
        'IT marketplace in Hyderabad',
        'Reseller / Commission Focused Keywords',
        'Earn commission from business leads',
        'Reseller platform for software tools',
        'Partner program for IT vendors India',
        'Sell business software leads',
        'BANT qualified lead marketplace India'
    ],
  },
  {
    id: 'prod_2',
    name: 'VoIP Business Phone System',
    type: 'Service',
    price: 50000,
    description: 'Cost-effective, feature-rich voice over IP solutions for modern businesses.',
    imageId: 'product-2',
    iconName: 'Wrench',
    vendorId: 'vendor_2',
    keywords: [
      'voip', 
      'phone system', 
      'business communication', 
      'telephony', 
      'CRM and cloud telephony in Delhi',
      'Cloud telephony solutions in Lucknow',
      'Cloud telephony service near me',
      'Cloud telephony and automation Pune',
      'Cloud and CRM tools providers Mumbai',
      'Yellow.ai',
      'Justdial',
      'Sulekha',
      'GetApp',
      'Clutch India',
      'TradeIndia',
      'Cloud telephony & IVR solutions',
      'B2B software vendors in Delhi',
      'Cloud software companies in Pune',
      'IT & SaaS Solutions Keywords',
      'WhatsApp Business API providers',
      'Marketing automation tools India',
      'BANTConfirm Branded Keywords',
      'Verified vendors BANTConfirm India',
      'Local + “Near Me” Keywords',
      'IT software solutions near me',
      'CRM providers in Mumbai',
      'Software resellers in Bangalore',
      'Reseller / Commission Focused Keywords',
      'Earn commission from business leads',
      'BANT qualified lead marketplace India'
    ],
  },
  {
    id: 'prod_3',
    name: 'Cloud Contact Center',
    type: 'Service',
    price: 150000,
    description: 'Scalable and intelligent contact center solutions to enhance customer experience.',
    imageId: 'product-5',
    iconName: 'CloudCog',
    vendorId: 'vendor_3',
    keywords: [
      'contact center', 
      'customer support', 
      'cloud', 
      'CX',
      'Cloud solutions providers Chennai',
      'Cloud and CRM tools providers Mumbai',
      'WhatsApp Business API setup near me',
      'Freshworks Marketplace',
      'Zoho Marketplace',
      'LeadSquared Marketplace',
      'G2',
      'Capterra India',
      'Tars',
      'WhatsApp Business API providers',
      'AI chatbot and voice agent software India',
      'Customer support automation solutions',
      'BANTConfirm B2B portal',
      'IT & SaaS Solutions Keywords',
      'Inventory management software India',
      'BANTConfirm Branded Keywords',
      'BANTConfirm IT marketplace',
      'Local + “Near Me” Keywords',
      'Cloud software companies in Pune',
      'Reseller / Commission Focused Keywords',
      'Sell business software leads'
    ],
  },
  {
    id: 'prod_4',
    name: 'Telecom Expense Management',
    type: 'Consulting',
    price: 100000,
    description: 'Optimize your telecom spend with our expert analysis and management services.',
    imageId: 'product-4',
    iconName: 'Briefcase',
    vendorId: 'vendor_4',
    keywords: [
      'telecom', 
      'expense management', 
      'cost optimization', 
      'auditing',
      'IT vendors and consultants in Navi Mumbai',
      'IT consulting and software marketplace Pune',
      'IT consultants in Bhubaneswar',
      'Best IT consulting company near me',
      'Clutch India',
      'Sulekha',
      'Justdial',
      'SoftwareSuggest',
      'TechJockey',
      'Partner program for IT vendors India',
      'Verified vendors BANTConfirm India',
    ],
  },
  {
    id: 'prod_5',
    name: 'Enterprise PBX & ERP/CRM Solutions',
    type: 'Hardware',
    price: 250000,
    description: 'Robust on-premise servers and fully integrated ERP/CRM systems for large-scale operations.',
    imageId: 'product-3',
    iconName: 'Server',
    vendorId: 'vendor_5',
    keywords: [
      'pbx', 
      'server', 
      'on-premise', 
      'enterprise phone system', 
      'ERP',
      'CRM',
      'CRM and ERP solutions in Ahmedabad',
      'ERP and CRM vendors in Hyderabad',
      'CRM and ERP marketplace in Nagpur',
      'CRM tools for small business Pune',
      'CRM service providers near me',
      'Zoho Marketplace',
      'LeadSquared Marketplace',
      'IndiaMART',
      'TradeIndia',
      'Udaan',
      'ExportersIndia',
      'CRM software for businesses India',
      'ERP and billing software India',
      'Inventory management software India',
      'CRM providers in Mumbai',
      'Software resellers in Bangalore',
    ],
  },
  {
    id: 'prod_6',
    name: 'Business Automation & IT Solutions',
    type: 'Service',
    price: 30000,
    description: 'Reliable SIP trunking and comprehensive IT solutions to streamline your business processes.',
    imageId: 'product-6',
    iconName: 'Lightbulb',
    vendorId: 'vendor_1',
    keywords: [
      'sip trunking', 
      'connectivity', 
      'pstn',
      'Business software solutions in Mumbai',
      'IT and software companies in Bangalore',
      'Business automation tools Hyderabad',
      'IT and software development solutions Chennai',
      'Software solutions providers Kolkata',
      'IT software vendors in Jaipur',
      'Business software in Indore',
      'Business automation solutions near me',
      'Post IT project requirements near me',
      'Software marketplace near me',
      'AppSumo',
      'StartupIndia Marketplace',
      'ResellerClub',
      'Marketing automation tools India',
      'Post your business requirement BANTConfirm',
      'IT marketplace in Hyderabad',
      'Earn commission from business leads',
      'Reseller platform for software tools',
      'Sell business software leads',
      'BANT qualified lead marketplace India',
    ],
  },
];


export type Vendor = {
  id: string;
  name: string;
  imageId: string;
  location: string;
};

export const vendors: Vendor[] = [
    { id: 'vendor_1', name: 'Airtel', imageId: 'vendor-airtel', location: 'Delhi, India' },
    { id: 'vendor_2', name: 'Tata Communications', imageId: 'vendor-tata', location: 'Mumbai, India' },
    { id: 'vendor_3', name: 'Jio', imageId: 'vendor-jio', location: 'Mumbai, India' },
    { id: 'vendor_4', name: 'Vodafone Idea', imageId: 'vendor-vi', location: 'Gandhinagar, India' },
    { id: 'vendor_5', name: 'BSNL', imageId: 'vendor-bsnl', location: 'Delhi, India' },
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
