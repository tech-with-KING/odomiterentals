import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";          

const firebaseConfig = {
  apiKey: "AIzaSyBY6bo3g1V-uDtGOamGgM0WZ_ekf3BnlGM",
  authDomain: "notion-clone-134fd.firebaseapp.com",
  projectId: "notion-clone-134fd",
  storageBucket: "notion-clone-134fd.firebasestorage.app",
  messagingSenderId: "175324826250",
  appId: "1:175324826250:web:14cf8478b9451b764dfb73",
  measurementId: "G-NSXXY05S2T"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Messaging
let messaging: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { messaging };