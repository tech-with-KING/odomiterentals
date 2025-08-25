// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyD2xqiRkhShxh06RJaaANiSC0ttnAUmmBo",
  authDomain: "odomiterentals-api.firebaseapp.com",
  projectId: "odomiterentals-api",
  storageBucket: "odomiterentals-api.firebasestorage.app",
  messagingSenderId: "414302898852",
  appId: "1:414302898852:web:af4605de2c94338332f431",
  measurementId: "1:414302898852:web:af4605de2c94338332f431"
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
