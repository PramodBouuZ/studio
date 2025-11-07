'use server';

import 'server-only';
import { unstable_cache as cache } from 'next/cache';
import { initializeFirebase } from '@/firebase/server';
import { collection, getDocs } from 'firebase/firestore';
import type { VendorProfile } from '@/lib/types';

export const getVendors = cache(
  async () => {
    const { firestore } = initializeFirebase();
    const vendorsCollection = collection(firestore, 'vendors');
    const snapshot = await getDocs(vendorsCollection);
    
    if (snapshot.empty) {
      return [];
    }
    
    const vendors: VendorProfile[] = [];
    snapshot.forEach(doc => {
      vendors.push({ id: doc.id, ...doc.data() } as VendorProfile);
    });
    
    return vendors;
  },
  ['vendors_list'], // Cache key
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['vendors'], // Cache tag for on-demand revalidation
  }
);
