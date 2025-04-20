
import { toast } from '@/hooks/use-toast';
import { IoTReminder } from '@/types';
import { useAppStore } from '@/lib/store';

/**
 * Check if the browser supports notifications
 */
export const checkNotificationPermission = (): boolean => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  return true;
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!checkNotificationPermission()) return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Show a notification
 */
export const showNotification = (title: string, options: NotificationOptions = {}): void => {
  if (!checkNotificationPermission()) return;
  
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        ...options,
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to toast
      toast({
        title,
        description: options.body,
      });
    }
  } else if (Notification.permission === 'default') {
    requestNotificationPermission().then(granted => {
      if (granted) {
        showNotification(title, options);
      }
    });
  } else {
    // Fallback to toast
    toast({
      title,
      description: options.body,
    });
  }
};

/**
 * Check for due reminders
 */
export const checkReminders = (): void => {
  const { reminders, updateReminder } = useAppStore.getState();
  
  const now = new Date();
  const dueReminders = reminders.filter(reminder => {
    const triggerTime = new Date(reminder.triggerTime);
    return reminder.isActive && !reminder.isRead && triggerTime <= now;
  });
  
  dueReminders.forEach(reminder => {
    // Show notification
    showNotification(reminder.title, {
      body: reminder.message,
      tag: reminder.id,
    });
    
    // Mark as read
    updateReminder(reminder.id, { isRead: true });
  });
};

/**
 * Schedule a period reminder
 */
export const scheduleReminder = (reminder: Omit<IoTReminder, 'id'>): void => {
  const { addReminder } = useAppStore.getState();
  addReminder(reminder);
  
  // Request permission if needed
  if (checkNotificationPermission() && Notification.permission === 'default') {
    requestNotificationPermission();
  }
};
