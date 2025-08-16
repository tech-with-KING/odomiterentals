"use client"

import { useEffect, useState } from 'react';
import { NotificationService } from '@/lib/notificationService';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

interface NotificationSetupProps {
  userEmail?: string;
}

export default function NotificationSetup({ userEmail = 'admin@odomiterentals.com' }: NotificationSetupProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // Check if notifications are already enabled
    const storedToken = notificationService.getStoredToken();
    if (storedToken && Notification.permission === 'granted') {
      setNotificationEnabled(true);
      setToken(storedToken);
    }

    // Setup foreground message listener
    notificationService.setupForegroundMessageListener();
  }, []);

  const enableNotifications = async () => {
    setLoading(true);
    try {
      const fcmToken = await notificationService.requestPermission();
      
      if (fcmToken) {
        // Save token to server
        await notificationService.saveTokenToServer(fcmToken, userEmail);
        setToken(fcmToken);
        setNotificationEnabled(true);
        
        // Show success message
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🔔 Notifications Enabled!', {
            body: 'You will now receive push notifications for new orders.',
            icon: '/logo.png'
          });
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert('Failed to enable notifications. Please check your browser settings.');
    } finally {
      setLoading(false);
    }
  };

  const disableNotifications = async () => {
    setLoading(true);
    try {
      if (token) {
        await notificationService.removeTokenFromServer(token);
      }
      
      localStorage.removeItem('fcm-token');
      setToken(null);
      setNotificationEnabled(false);
      
      alert('Notifications have been disabled.');
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if browser doesn't support notifications
  if (typeof window !== 'undefined' && !('Notification' in window)) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {notificationEnabled ? (
        <Button
          variant="outline"
          size="sm"
          onClick={disableNotifications}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Bell className="w-4 h-4 text-green-600" />
          <span className="text-sm">Notifications On</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={enableNotifications}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <BellOff className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {loading ? 'Enabling...' : 'Enable Notifications'}
          </span>
        </Button>
      )}
    </div>
  );
}
