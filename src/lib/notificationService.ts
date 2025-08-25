import { messaging } from '../../firebase';
import { getToken, onMessage } from 'firebase/messaging';

export class NotificationService {
  private static instance: NotificationService;
  private static readonly VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'BOJd2gvF5f_Ee3wBp4ANQoUULTlEj9NLUz40KBv26W_ckS9rIEnSFT35kxAh4GulR59uLqL7lrT7NVkDWxEWboA'; 

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<string | null> {
    if (!messaging) {
      console.warn('Firebase messaging not supported');
      return null;
    }

    // Check if VAPID key is configured
    if (!NotificationService.VAPID_KEY || NotificationService.VAPID_KEY.includes('YOUR_VAPID_KEY')) {
      console.error('VAPID key not configured. Please set NEXT_PUBLIC_FIREBASE_VAPID_KEY in your environment variables.');
      alert('Push notifications are not configured. Please contact your administrator.');
      return null;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get registration token
        const token = await getToken(messaging, {
          vapidKey: NotificationService.VAPID_KEY
        });
        
        if (token) {
          console.log('Registration token:', token);
          // Store token in localStorage for persistence
          localStorage.setItem('fcm-token', token);
          return token;
        } else {
          console.log('No registration token available.');
          return null;
        }
      } else {
        console.log('Unable to get permission to notify.');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      return null;
    }
  }

  setupForegroundMessageListener(): void {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      
      // Show notification in foreground
      if (payload.notification) {
        this.showNotification(
          payload.notification.title || 'New Notification',
          payload.notification.body || 'You have a new notification',
          payload.data
        );
      }
    });
  }

  private showNotification(title: string, body: string, data?: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'order-notification',
        data
      });

      notification.onclick = () => {
        window.focus();
        if (data?.orderId) {
          // Navigate to specific order or orders page
          window.location.href = '/admin/orders';
        }
        notification.close();
      };
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('fcm-token');
  }

  async saveTokenToServer(token: string, userEmail: string): Promise<void> {
    try {
      await fetch('/api/save-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, userEmail }),
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  async removeTokenFromServer(token: string): Promise<void> {
    try {
      await fetch('/api/remove-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  }
}
