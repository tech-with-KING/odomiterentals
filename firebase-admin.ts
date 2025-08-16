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
const serviceKey = require('@/service_key.json');
let app: App;

if (getApps().length === 0) {
   app = initializeApp({
        credential: cert(serviceKey),
    });
}
else {
    app = getApp();
}
const adminDb = getFirestore(app);
const adminMessaging = getMessaging(app);

export {app as adminApp, adminDb as adminDb, adminMessaging};