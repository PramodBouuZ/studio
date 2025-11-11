import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { AIChatProvider } from '@/components/ai-chat';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bantconfirm.com'),
  title: 'BANTConfirm | AI-Powered B2B Marketplace for Telecom & IT',
  description: 'BANTConfirm is an AI-powered B2B marketplace that connects businesses with top-tier vendors for telecom and IT services. Get qualified leads and streamline your procurement process.',
  keywords: ['B2B Marketplace', 'AI-Powered', 'Telecom', 'IT Services', 'Lead Generation', 'Procurement', 'BANT', 'Vendor Marketplace', 'Business Software', 'SaaS'],
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "BANTConfirm",
      "alternateName": ["Bant confirm", "bantconfirm"],
      "url": "https://www.bantconfirm.com",
      "logo": "https://www.bantconfirm.com/logo.png", // Assuming you will have a logo at this URL
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "9310269821",
        "contactType": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": ["en"]
      },
      "sameAs": [
        // Add your social media URLs here when available
      ]
    },
    {
      "@type": "WebSite",
      "url": "https://www.bantconfirm.com",
      "name": "BANTConfirm",
      "description": "AI-Powered B2B Marketplace for Telecom & IT",
      "publisher": {
        "@id": "https://www.bantconfirm.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.bantconfirm.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', inter.variable)}>
        <FirebaseClientProvider>
          <AIChatProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AIChatProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
