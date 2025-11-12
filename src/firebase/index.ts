'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }
  
  const firebaseApp = initializeApp(firebaseConfig);

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  const firestore = getFirestore(firebaseApp);
  // In a real app, you might want to connect to emulators in development
  // if (process.env.NODE_ENV === 'development') {
  //   connectFirestoreEmulator(firestore, 'localhost', 8080);
  // }
  
  const auth = getAuth(firebaseApp);
  // if (process.env.NODE_ENV === 'development') {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  // }

  return {
    firebaseApp,
    auth,
    firestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';