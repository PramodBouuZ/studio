
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.bantconfirm.com';

  // Add all main pages to the sitemap
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/login`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/signup`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/become-a-vendor`, priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  // NOTE: A more robust solution for dynamic product pages would be to fetch
  // the product list from an API endpoint here. For now, we are keeping it static
  // to prevent build failures related to database connections during the build process.
  
  const sections = [
    { url: `${baseUrl}/#products`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/#vendors`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/#testimonials`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/#about-us`, priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  const allEntries: MetadataRoute.Sitemap = [
    ...staticPages.map(({url, priority, changeFrequency}) => ({ url, priority, lastModified: new Date(), changeFrequency })),
    ...sections.map(({url, priority, changeFrequency}) => ({ url, priority, lastModified: new Date(), changeFrequency })),
  ];

  return allEntries;
}
