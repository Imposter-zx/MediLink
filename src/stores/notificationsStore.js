import { create } from 'zustand';

/**
 * Notifications Store - Manages in-app alerts and reminders
 * 
 * Handles:
 * - Medication reminders
 * - Order status updates
 * - System alerts
 * - Emergency notifications
 */

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  MEDICATION_REMINDER: 'medication_reminder',
  ORDER_UPDATE: 'order_update',
  EMERGENCY: 'emergency',
};

export const useNotificationsStore = create((set, get) => ({
  // Array of notifications
  notifications: [],
  
  // Unread count
  unreadCount: 0,
  
  /**
   * Add a new notification
   * @param {Object} notification - { id, type, title, message, timestamp, read }
   */
  addNotification: (notification) => {
    const newNotification = {
      id: notification.id || `notif-${Date.now()}`,
      type: notification.type || NOTIFICATION_TYPES.INFO,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
    
    // Auto-dismiss info notifications after 5 seconds
    if (newNotification.type === NOTIFICATION_TYPES.INFO) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 5000);
    }
  },
  
  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   */
  markAsRead: (id) => set((state) => {
    const notification = state.notifications.find(n => n.id === id);
    if (!notification || notification.read) return state;
    
    return {
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    };
  }),
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  
  /**
   * Remove a notification
   * @param {string} id - Notification ID
   */
  removeNotification: (id) => set((state) => {
    const notification = state.notifications.find(n => n.id === id);
    const wasUnread = notification && !notification.read;
    
    return {
      notifications: state.notifications.filter(n => n.id !== id),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),
  
  /**
   * Clear all notifications
   */
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  
  /**
   * Get notifications by type
   * @param {string} type - Notification type
   * @returns {Array} Filtered notifications
   */
  getByType: (type) => {
    return get().notifications.filter(n => n.type === type);
  },
  
  /**
   * Get unread notifications
   * @returns {Array} Unread notifications
   */
  getUnread: () => {
    return get().notifications.filter(n => !n.read);
  },
  
  /**
   * Add medication reminder
   * @param {Object} medication - { name, dosage, time }
   */
  addMedicationReminder: (medication) => {
    get().addNotification({
      type: NOTIFICATION_TYPES.MEDICATION_REMINDER,
      title: 'Medication Reminder',
      message: `Time to take ${medication.name} (${medication.dosage})`,
      metadata: medication,
    });
  },
  
  /**
   * Add order status update
   * @param {Object} order - { id, status, medication }
   */
  addOrderUpdate: (order) => {
    get().addNotification({
      type: NOTIFICATION_TYPES.ORDER_UPDATE,
      title: 'Order Update',
      message: `Your order #${order.id} is now ${order.status}`,
      metadata: order,
    });
  },
}));
