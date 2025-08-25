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
       
       // Always use the service account file for reliability
       try {
         console.log('Using service account file for Firebase Admin');
         const serviceKey = require('./src/service_key.json');
         console.log('Service account project ID:', serviceKey.project_id);
         credential = cert(serviceKey);
       } catch (error) {
         console.error('Could not load service account key:', error);
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
