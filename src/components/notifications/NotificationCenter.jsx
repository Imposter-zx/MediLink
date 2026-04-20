import React, { useState, useEffect } from 'react';

/**
 * Notification Center Component
 * View and manage all notifications
 */
function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Load notifications from server
   */
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter notifications
   */
  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(n => n.read === false);
        break;
      case 'refill':
        filtered = filtered.filter(n => n.templateId.includes('refill'));
        break;
      case 'delivery':
        filtered = filtered.filter(n => n.templateId.includes('delivery'));
        break;
    }

    return filtered;
  };

  /**
   * Mark notification as read
   */
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
      setNotifications(
        notifications.map(n => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  /**
   * Delete notification
   */
  const handleDelete = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  /**
   * Mark all as read
   */
  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  /**
   * Get notification icon based on template
   */
  const getIcon = (templateId: string) => {
    if (templateId.includes('refill')) return '💊';
    if (templateId.includes('delivery')) return '🚚';
    if (templateId.includes('appointment')) return '📅';
    if (templateId.includes('alert')) return '⚠️';
    return '📢';
  };

  /**
   * Get notification color based on type
   */
  const getColorClass = (templateId: string) => {
    if (templateId.includes('refill')) return 'border-l-4 border-l-blue-500';
    if (templateId.includes('delivery')) return 'border-l-4 border-l-green-500';
    if (templateId.includes('alert')) return 'border-l-4 border-l-red-500';
    return 'border-l-4 border-l-gray-500';
  };

  const filtered = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-gray-600 text-sm mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`pb-2 px-4 font-semibold whitespace-nowrap ${
            activeFilter === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`pb-2 px-4 font-semibold whitespace-nowrap ${
            activeFilter === 'unread'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('refill')}
          className={`pb-2 px-4 font-semibold whitespace-nowrap ${
            activeFilter === 'refill'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Refills
        </button>
        <button
          onClick={() => setActiveFilter('delivery')}
          className={`pb-2 px-4 font-semibold whitespace-nowrap ${
            activeFilter === 'delivery'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Deliveries
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(notification => (
          <div
            key={notification.id}
            className={`bg-white border rounded-lg p-4 ${getColorClass(notification.templateId)} hover:shadow-md transition ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getIcon(notification.templateId)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{notification.subject}</h3>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>

                    {/* Notification Details */}
                    {notification.details && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <p className="text-gray-600">{notification.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="bg-gray-50 border rounded-lg p-12 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-gray-600 text-lg">
              {activeFilter === 'all' ? 'No notifications yet' : `No ${activeFilter} notifications`}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {activeFilter === 'all'
                ? 'Check back later for updates about your prescriptions and deliveries'
                : 'Try a different filter'}
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
