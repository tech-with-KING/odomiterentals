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

// Initialize Firebase Admin SDK immediately
let app: App;

function initializeFirebaseAdmin(): { app: App; adminDb: any; adminMessaging: any } {
   if (getApps().length === 0) {
       let credential;
       
       console.log('Initializing Firebase Admin SDK...');
       
       // Try environment variables first, then fall back to service account file
       try {
         if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
           console.log('Using environment variables for Firebase Admin');
           credential = cert({
             projectId: process.env.FIREBASE_PROJECT_ID,
             clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
             privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
           });
           console.log('Service account from env - project ID:', process.env.FIREBASE_PROJECT_ID);
         } else {
           console.log('Using service account file for Firebase Admin');
           const serviceKey = require('./src/service_key.json');
           console.log('Service account project ID:', serviceKey.project_id);
           credential = cert(serviceKey);
         }
       } catch (error) {
         console.error('Could not load Firebase credentials:', error);
         throw new Error('Firebase Admin SDK could not be initialized. Please check your service account configuration.');
       }

       try {
         app = initializeApp({
            credential,
            projectId: 'odomiterentals-api', // Use the correct project ID directly
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

   // Verify the database is accessible
   console.log('Firebase Admin DB initialized:', !!adminDb);
   console.log('Firebase Admin Messaging initialized:', !!adminMessaging);

   return { app, adminDb, adminMessaging };
}

// Initialize immediately when module is loaded
const firebaseAdmin = initializeFirebaseAdmin();

export const adminApp = firebaseAdmin.app;
export const adminDb = firebaseAdmin.adminDb;
export const adminMessaging = firebaseAdmin.adminMessaging;
