"use client"

import { useEffect, useState } from 'react';
import { NotificationService } from '@/lib/notificationService';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useFeedback } from '@/context/feedback';

interface NotificationSetupProps {
  userEmail?: string;
}

export default function NotificationSetup({ userEmail = 'admin@odomiterentals.com' }: NotificationSetupProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useFeedback();

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
      toast({
        title: 'Could not turn on alerts',
        description:
          error instanceof Error
            ? error.message
            : 'Check that this browser allows notifications for the site.',
        tone: 'error',
      });
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

      toast({ title: 'Order alerts turned off', tone: 'success' });
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast({ title: 'Could not turn off alerts', tone: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Don't render if browser doesn't support notifications
  if (typeof window !== 'undefined' && !('Notification' in window)) {
    return null;
  }

  // Label collapses on small screens — the topbar has no room for it there.
  return notificationEnabled ? (
    <Button
      variant="outline"
      size="sm"
      onClick={disableNotifications}
      disabled={loading}
      className="gap-2 rounded-full"
      title="Turn off order notifications"
    >
      <Bell className="h-4 w-4 text-[color:var(--sage)]" />
      <span className="hidden text-xs md:inline">Alerts on</span>
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={enableNotifications}
      disabled={loading}
      className="gap-2 rounded-full"
      title="Get a push notification for every new order"
    >
      <BellOff className="h-4 w-4 text-[color:var(--muted-ink)]" />
      <span className="hidden text-xs md:inline">{loading ? 'Enabling…' : 'Enable alerts'}</span>
    </Button>
  );
}
