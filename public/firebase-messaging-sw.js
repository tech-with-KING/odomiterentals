// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyBY6bo3g1V-uDtGOamGgM0WZ_ekf3BnlGM",
  authDomain: "notion-clone-134fd.firebaseapp.com",
  projectId: "notion-clone-134fd",
  storageBucket: "notion-clone-134fd.firebasestorage.app",
  messagingSenderId: "175324826250",
  appId: "1:175324826250:web:14cf8478b9451b764dfb73",
  measurementId: "G-NSXXY05S2T"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'order-notification',
    data: payload.data,
    actions: [
      {
        action: 'view-order',
        title: 'View Order'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  if (event.action === 'view-order') {
    // Open the admin orders page
    event.waitUntil(
      clients.openWindow('/admin/orders')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open admin orders page
    event.waitUntil(
      clients.openWindow('/admin/orders')
    );
  }
});
