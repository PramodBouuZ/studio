import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bantconfirm.com';

  // Add all main pages to the sitemap
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/login`, priority: 0.5 },
    { url: `${baseUrl}/signup`, priority: 0.8 },
    { url: `${baseUrl}/become-a-vendor`, priority: 0.8 },
  ];

  // In the future, you could dynamically generate sitemap entries
  // for products or vendors from your database.
  // For now, we'll just add the main sections.
  const sections = [
    { url: `${baseUrl}/#products`, priority: 0.9 },
    { url: `${baseUrl}/#vendors`, priority: 0.7 },
    { url: `${baseUrl}/#testimonials`, priority: 0.6 },
    { url: `${baseUrl}/#about-us`, priority: 0.7 },
  ];

  const allEntries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...sections,
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }));

  return allEntries;
}
