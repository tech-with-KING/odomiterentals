# Firebase Push Notifications Setup Instructions

This project now includes Firebase push notifications for new orders. Follow these steps to set up notifications:

## 1. Generate VAPID Key

1. Go to Firebase Console -> Project Settings -> Cloud Messaging
2. In the "Web configuration" section, click "Generate key pair"
3. Copy the generated VAPID key

## 2. Environment Variables

Add these to your `.env.local` file:

```
# Existing variables (keep these)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
BUSINESS_EMAIL=admin@odomiterentals.com
BUSINESS_WHATSAPP_NUMBER=+1234567890
NEXT_PUBLIC_APP_URL=http://localhost:3000

# New Firebase Push Notification Variables
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key-here
```

## 3. Update NotificationService

In `src/lib/notificationService.ts`, replace `YOUR_VAPID_KEY` with your actual VAPID key or use the environment variable:

```typescript
private static readonly VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY';
```

## 4. Service Worker

The service worker (`public/firebase-messaging-sw.js`) is already configured. Make sure your domain serves it correctly.

## 5. Testing

1. Go to the admin dashboard
2. Click "Enable Notifications" in the top right
3. Allow notifications when prompted
4. Use the "Test Notification" button on the orders page
5. You should receive a push notification

## 6. Admin Users

For production, you'll want to:
1. Set up proper admin authentication
2. Store admin emails in your database
3. Only send notifications to verified admin users

## How It Works

1. When an admin enables notifications, their FCM token is saved to Firestore
2. When a new order is submitted, the API sends a push notification to all active admin tokens
3. Notifications work both when the browser is open (foreground) and closed (background)
4. Failed tokens are automatically cleaned up

## Troubleshooting

- Make sure your site is served over HTTPS in production
- Check browser console for any Firebase errors
- Verify that the service worker is registered correctly
- Ensure Firestore security rules allow admin token operations
