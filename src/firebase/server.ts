import 'server-only';

import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// This is a temporary solution to get the config from the client-side config.
// In a real-world scenario, you would use environment variables for the service account.
import { firebaseConfig } from './config';

const firebaseAdminConfig: FirebaseOptions = {
    credential: {
        projectId: firebaseConfig.projectId,
        clientEmail: `firebase-adminsdk-qaa1n@${firebaseConfig.projectId}.iam.gserviceaccount.com`,
        // NOTE: This private key is a placeholder and should be replaced with a real one from a secure environment variable.
        privateKey: process.env.FIREBASE_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJ7j5/23N4/yZ/\n...\n-----END PRIVATE KEY-----\n`,
    },
    projectId: firebaseConfig.projectId,
};

function getAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }
    // In a real app, you would use applicationDefault() or a service account file.
    // For this environment, we'll initialize with the config.
    return initializeApp(firebaseAdminConfig, 'admin');
}

export function initializeFirebase() {
    const app = getAdminApp();
    return {
        app: app,
        auth: getAuth(app),
        firestore: getFirestore(app),
    };
}
