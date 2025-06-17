import webpush from 'web-push';

// Configure web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@wakr.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: Record<string, any>;
}

export class PushNotificationService {
  static async sendNotification(
    subscription: PushSubscription,
    payload: PushNotificationPayload
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const notificationPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/badge-72x72.png',
        image: payload.image,
        url: payload.url || '/',
        tag: payload.tag || 'default',
        requireInteraction: payload.requireInteraction || false,
        actions: payload.actions || [],
        data: {
          dateOfArrival: Date.now(),
          ...payload.data
        }
      });

      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: subscription.keys
      };

      await webpush.sendNotification(pushSubscription, notificationPayload);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async sendToMultipleSubscriptions(
    subscriptions: PushSubscription[],
    payload: PushNotificationPayload
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = await Promise.allSettled(
      subscriptions.map(sub => this.sendNotification(sub, payload))
    );

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        success++;
      } else {
        failed++;
        if (result.status === 'rejected') {
          errors.push(`Subscription ${index}: ${result.reason}`);
        } else if (result.status === 'fulfilled' && result.value.error) {
          errors.push(`Subscription ${index}: ${result.value.error}`);
        }
      }
    });

    return { success, failed, errors };
  }

  // Pre-defined notification types
  static async sendWakeUpChallenge(
    subscriptions: PushSubscription[],
    userName: string,
    challengeType: string = 'math'
  ) {
    const payload: PushNotificationPayload = {
      title: `Wake Up, ${userName}! 🌅`,
      body: `Your ${challengeType} challenge is ready. Complete it to prove you're awake!`,
      icon: '/icons/wake-192.png',
      url: '/dashboard/wake-calls/challenge',
      tag: 'wake-challenge',
      requireInteraction: true,
      actions: [
        {
          action: 'open-challenge',
          title: 'Take Challenge',
          icon: '/icons/challenge.png'
        },
        {
          action: 'snooze',
          title: 'Snooze 5min',
          icon: '/icons/snooze.png'
        }
      ],
      data: {
        type: 'wake_challenge',
        challengeType
      }
    };

    return this.sendToMultipleSubscriptions(subscriptions, payload);
  }

  static async sendHabitReminder(
    subscriptions: PushSubscription[],
    habitName: string,
    habitIcon: string = '📌'
  ) {
    const payload: PushNotificationPayload = {
      title: `Habit Reminder ${habitIcon}`,
      body: `Time for "${habitName}"! Keep your streak going.`,
      url: '/dashboard/habits',
      tag: 'habit-reminder',
      actions: [
        {
          action: 'complete',
          title: '✓ Mark Complete'
        },
        {
          action: 'snooze',
          title: '⏰ Remind Later'
        }
      ],
      data: {
        type: 'habit_reminder',
        habitName
      }
    };

    return this.sendToMultipleSubscriptions(subscriptions, payload);
  }

  static async sendStreakCelebration(
    subscriptions: PushSubscription[],
    habitName: string,
    streakDays: number
  ) {
    const payload: PushNotificationPayload = {
      title: `🔥 ${streakDays} Day Streak!`,
      body: `Amazing! You've maintained "${habitName}" for ${streakDays} days straight!`,
      url: '/dashboard/habits',
      tag: 'streak-celebration',
      actions: [
        {
          action: 'view-habits',
          title: 'View Progress'
        }
      ],
      data: {
        type: 'streak_celebration',
        habitName,
        streakDays
      }
    };

    return this.sendToMultipleSubscriptions(subscriptions, payload);
  }

  static async sendAchievementUnlocked(
    subscriptions: PushSubscription[],
    achievementName: string,
    achievementIcon: string = '🏆'
  ) {
    const payload: PushNotificationPayload = {
      title: `${achievementIcon} Achievement Unlocked!`,
      body: `Congratulations! You've earned "${achievementName}".`,
      url: '/dashboard/achievements',
      tag: 'achievement',
      requireInteraction: true,
      actions: [
        {
          action: 'view-achievement',
          title: 'View Details'
        }
      ],
      data: {
        type: 'achievement_unlocked',
        achievementName
      }
    };

    return this.sendToMultipleSubscriptions(subscriptions, payload);
  }

  static async sendSubscriptionReminder(
    subscriptions: PushSubscription[],
    daysUntilExpiry: number
  ) {
    const payload: PushNotificationPayload = {
      title: '⚠️ Subscription Expiring Soon',
      body: `Your Wakr subscription expires in ${daysUntilExpiry} days. Renew to keep your progress!`,
      url: '/dashboard/settings/billing',
      tag: 'subscription-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'renew',
          title: 'Renew Now'
        }
      ],
      data: {
        type: 'subscription_reminder',
        daysUntilExpiry
      }
    };

    return this.sendToMultipleSubscriptions(subscriptions, payload);
  }

  static async sendCustomReminder(
    subscriptions: PushSubscription[],
    title: string,
    message: string,
    url?: string
  ) {
    const payload: PushNotificationPayload = {
      title,
      body: message,
      url: url || '/dashboard',
      tag: 'custom-reminder',
      data: {
        type: 'custom_reminder'
      }
    };

    return this.sendToMultipleSubscriptions(subscriptions, payload);
  }
}

// Client-side subscription management
export class PushSubscriptionManager {
  static async isSupported(): Promise<boolean> {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    return await Notification.requestPermission();
  }

  static async subscribe(): Promise<PushSubscription | null> {
    if (!await this.isSupported()) {
      throw new Error('Push notifications not supported');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        )
      });

      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  static async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        return await subscription.unsubscribe();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  static async getSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) return null;

      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}