import React, { useState, useEffect } from 'react';

/**
 * Notification Preferences Component
 * Manage email, SMS, push, and in-app notifications
 */
function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    refillNotifications: true,
    deliveryUpdates: true,
    promotionalEmails: false,
    weeklyDigest: false,
    quietHoursStart: null as string | null,
    quietHoursEnd: null as string | null,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  /**
   * Load user notification preferences
   */
  const loadPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save preferences
   */
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle preference
   */
  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
    setSaved(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Notification Preferences</h2>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <p className="text-green-800">✅ Preferences saved successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Communication Channels */}
        <section className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Communication Channels</h3>

          <div className="space-y-4">
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => togglePreference('emailNotifications')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive important updates via email</p>
              </div>
              <span className="text-2xl">📧</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={() => togglePreference('smsNotifications')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive urgent alerts via text message</p>
              </div>
              <span className="text-2xl">📱</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={() => togglePreference('pushNotifications')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">Push Notifications</p>
                <p className="text-sm text-gray-600">Get real-time alerts on your device</p>
              </div>
              <span className="text-2xl">🔔</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.inAppNotifications}
                onChange={() => togglePreference('inAppNotifications')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">In-App Notifications</p>
                <p className="text-sm text-gray-600">See updates when you're using MediLink</p>
              </div>
              <span className="text-2xl">💬</span>
            </label>
          </div>
        </section>

        {/* Notification Types */}
        <section className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Notification Types</h3>

          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.refillNotifications}
                onChange={() => togglePreference('refillNotifications')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">Refill Reminders</p>
                <p className="text-sm text-gray-600">Get notified when prescriptions need refills</p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.deliveryUpdates}
                onChange={() => togglePreference('deliveryUpdates')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">Delivery Updates</p>
                <p className="text-sm text-gray-600">Track your prescription deliveries in real-time</p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.promotionalEmails}
                onChange={() => togglePreference('promotionalEmails')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">Promotional Offers</p>
                <p className="text-sm text-gray-600">Receive special deals and promotions</p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={() => togglePreference('weeklyDigest')}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold">Weekly Summary</p>
                <p className="text-sm text-gray-600">Get a weekly digest of your health activity</p>
              </div>
            </label>
          </div>
        </section>

        {/* Quiet Hours */}
        <section className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quiet Hours</h3>
          <p className="text-gray-600 mb-4">Disable notifications during specific times of day</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Start Time</label>
              <input
                type="time"
                value={preferences.quietHoursStart || ''}
                onChange={e => setPreferences({ ...preferences, quietHoursStart: e.target.value || null })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">End Time</label>
              <input
                type="time"
                value={preferences.quietHoursEnd || ''}
                onChange={e => setPreferences({ ...preferences, quietHoursEnd: e.target.value || null })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {preferences.quietHoursStart && preferences.quietHoursEnd && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                Notifications will be silenced from <strong>{preferences.quietHoursStart}</strong> to{' '}
                <strong>{preferences.quietHoursEnd}</strong> (except emergencies)
              </p>
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? 'Saving...' : '💾 Save Preferences'}
          </button>
          <button
            onClick={loadPreferences}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Note:</strong> Urgent notifications (like emergency alerts) will always come through, even if you disable that channel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreferences;
