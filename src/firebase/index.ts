'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// This object will hold the initialized Firebase services.
let firebaseServices: {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null = null;

// This is the function that initializes Firebase.
// It ensures that initialization only happens once.
function getFirebaseServices() {
  if (firebaseServices) {
    return firebaseServices;
  }

  // Check if any Firebase app has already been initialized.
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // In a real app, you might want to connect to emulators in development.
  // This is commented out to ensure it connects to the real Firebase services.
  // if (process.env.NODE_ENV === 'development') {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectFirestoreEmulator(firestore, 'localhost', 8080);
  // }

  firebaseServices = {
    firebaseApp: app,
    auth,
    firestore,
  };

  return firebaseServices;
}


// IMPORTANT: The initializeFirebase function is now simplified to just call getFirebaseServices.
export function initializeFirebase() {
  return getFirebaseServices();
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
