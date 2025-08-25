# Firebase Push Notifications Setup Instructions

This project now includes Firebase push notifications for new orders. Follow these steps to set up notifications:

## 🚨 IMPORTANT: Service Account Setup Required

The error you're seeing is because we need to generate a proper Firebase Admin SDK service account for your project.

### Step 1: Generate Firebase Admin SDK Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **odomiterentals-api**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate new private key**
6. Download the JSON file
7. Replace the content of `src/service_key.json` with the downloaded file

### Step 2: Verify VAPID Key

1. In Firebase Console → Project Settings → **Cloud Messaging**
2. In the "Web configuration" section, verify your VAPID key
3. Make sure this matches the one in your `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=BOJd2gvF5f_Ee3wBp4ANQoUULTlEj9NLUz40KBv26W_ckS9rIEnSFT35kxAh4GulR59uLqL7lrT7NVkDWxEWboA
   ```

### Step 3: Update Environment Variables

Your `.env.local` should have:

```bash
# Firebase Admin SDK Configuration (will be auto-filled after Step 1)
FIREBASE_PROJECT_ID=odomiterentals-api
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@odomiterentals-api.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Client Configuration (already set)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD2xqiRkhShxh06RJaaANiSC0ttnAUmmBo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=odomiterentals-api.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=odomiterentals-api
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=odomiterentals-api.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=414302898852
NEXT_PUBLIC_FIREBASE_APP_ID=1:414302898852:web:af4605de2c94338332f431
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BOJd2gvF5f_Ee3wBp4ANQoUULTlEj9NLUz40KBv26W_ckS9rIEnSFT35kxAh4GulR59uLqL7lrT7NVkDWxEWboA
```

### Step 4: Test Setup

1. Restart your development server
2. Go to `/admin/orders`
3. Click "Enable Notifications" and allow permissions
4. Click "Test Notification"
5. You should receive a push notification

## Common Issues & Solutions

### Issue: "Request had invalid authentication credentials"
**Solution**: Generate a new service account as described in Step 1

### Issue: "No registration token available"
**Solution**: Make sure you're using HTTPS in production, or localhost in development

### Issue: "Firebase messaging not supported"
**Solution**: Make sure you're testing in a supported browser (Chrome, Firefox, Edge)

## Files Modified

- ✅ `firebase.ts` - Updated to use correct project
- ✅ `firebase-admin.ts` - Added proper service account handling
- ✅ `public/firebase-messaging-sw.js` - Service worker for background notifications
- ✅ `src/lib/notificationService.ts` - Notification management
- ✅ API routes for FCM token management and sending notifications
- ✅ Admin dashboard with notification controls

## How It Works

1. **Admin Setup**: Admins enable notifications → FCM token saved to Firestore
2. **New Order**: Customer places order → Push notification sent to all admin devices
3. **Real-time**: Works whether browser is open (foreground) or closed (background)
4. **Cleanup**: Failed tokens automatically removed

The notifications show:
- 🛍️ "New Order Received!"
- Customer name and order total
- Click to navigate to admin orders page
