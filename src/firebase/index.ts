'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
// Check if Firebase has already been initialized
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp(); // If already initialized, use the existing app
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export function initializeFirebase() {
    return { firebaseApp, auth, firestore };
}

// Export all hooks and providers
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';
