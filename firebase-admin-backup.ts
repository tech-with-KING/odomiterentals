import {
    App,
    initializeApp,
    getApps,
    getApp,
    cert,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

let app: App;

import {
    App,
    initializeApp,
    getApps,
    getApp,
    cert,
    applicationDefault,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

let app: App;

if (getApps().length === 0) {
   // Try to get service account from environment variables first
   let credential;
   
   console.log('Initializing Firebase Admin SDK...');
   console.log('Environment check:', {
     hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
     hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
     hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
     hasGoogleCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS
   });
   
   if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
     // Use application default credentials (for Google Cloud environments)
     console.log('Using application default credentials');
     credential = applicationDefault();
   } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
     // Use environment variables (recommended for production)
     console.log('Using environment variables for Firebase Admin');
     credential = cert({
       projectId: process.env.FIREBASE_PROJECT_ID,
       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
     });
   } else {
     // Fallback to JSON file for development
     try {
       console.log('Using service account file for Firebase Admin');
       const serviceKey = require('./src/service_key.json');
       console.log('Service account project ID:', serviceKey.project_id);
       credential = cert(serviceKey);
     } catch (error) {
       console.error('Could not load service account key:', error);
       throw new Error('Firebase Admin SDK could not be initialized. Please check your service account configuration.');
     }
   }

   try {
     app = initializeApp({
        credential,
        // Explicitly set project ID if available
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
     });
     console.log('Firebase Admin SDK initialized successfully');
   } catch (error) {
     console.error('Failed to initialize Firebase Admin SDK:', error);
     throw error;
   }
}
else {
    app = getApp();
    console.log('Using existing Firebase Admin app');
}

const adminDb = getFirestore(app);
const adminMessaging = getMessaging(app);

export {app as adminApp, adminDb as adminDb, adminMessaging};