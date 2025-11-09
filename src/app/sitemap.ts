
import { MetadataRoute } from 'next'
import { initializeFirebase } from '@/firebase/server';
import { Product } from '@/lib/data';

 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.bantconfirm.com';

  const { firestore } = initializeFirebase();

  // Add all main pages to the sitemap
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/login`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/signup`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/become-a-vendor`, priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  // Dynamically generate sitemap entries for products from Firestore
  const productsSnapshot = await firestore.collection('products').get();
  const productPages = productsSnapshot.docs.map(doc => {
    const product = doc.data() as Product;
    return {
      url: `${baseUrl}/products/${product.id}`,
      priority: 0.9,
      changeFrequency: 'weekly' as const,
      lastModified: new Date(),
    };
  });

  const sections = [
    { url: `${baseUrl}/#products`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/#vendors`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/#testimonials`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/#about-us`, priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  const allEntries: MetadataRoute.Sitemap = [
    ...staticPages.map(({url, priority, changeFrequency}) => ({ url, priority, lastModified: new Date(), changeFrequency })),
    ...productPages,
    ...sections.map(({url, priority, changeFrequency}) => ({ url, priority, lastModified: new Date(), changeFrequency })),
  ];

  return allEntries;
}
