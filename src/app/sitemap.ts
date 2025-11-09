
import { MetadataRoute } from 'next'
import { products } from '@/lib/data';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bantconfirm.com';

  // Add all main pages to the sitemap
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/login`, priority: 0.5 },
    { url: `${baseUrl}/signup`, priority: 0.8 },
    { url: `${baseUrl}/become-a-vendor`, priority: 0.8 },
  ];

  // Dynamically generate sitemap entries for products
  const productPages = products.map(product => ({
    url: `${baseUrl}/products/${product.id}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
    lastModified: new Date(),
  }));

  // In the future, you could dynamically generate sitemap entries
  // for vendors from your database.
  const sections = [
    { url: `${baseUrl}/#products`, priority: 0.9 },
    { url: `${baseUrl}/#vendors`, priority: 0.7 },
    { url: `${baseUrl}/#testimonials`, priority: 0.6 },
    { url: `${baseUrl}/#about-us`, priority: 0.7 },
  ];

  const allEntries: MetadataRoute.Sitemap = [
    ...staticPages.map(({url, priority}) => ({ url, priority, lastModified: new Date(), changeFrequency: 'monthly' as const })),
    ...productPages,
    ...sections.map(({url, priority}) => ({ url, priority, lastModified: new Date(), changeFrequency: 'weekly' as const })),
  ];

  return allEntries;
}
