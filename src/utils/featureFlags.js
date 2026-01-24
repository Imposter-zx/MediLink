import { useState, useEffect } from 'react';

export const FLAGS = {
  LANDING_3D: "landing_3d_enabled",
  DARK_MODE: "dark_mode_enabled",
  VOICE_ASSISTANT: "voice_assistant_enabled",
  MEDICATION_REMINDERS: "medication_reminders_enabled",
};

/**
 * Feature Flag Hook
 * 
 * Centralized management for toggling features.
 * Priority: 
 * 1. Backend/Remote Config (if connected)
 * 2. Local Storage Override
 * 3. Default Value
 * 
 * @param {string} flagName - Constant from FLAGS
 * @param {boolean} defaultValue - Fallback value
 * @returns {boolean} - Whether the feature is enabled
 */
export const useFeatureFlag = (flagName, defaultValue = false) => {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(`flag_${flagName}`);
      return stored !== null ? stored === "true" : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Mock fetching remote configuration
  useEffect(() => {
    // In production, replace with fetch('/api/features/...')
    const checkRemoteFlag = async () => {
      // Simulate network delay
      // await new Promise(r => setTimeout(r, 500));
      
      // Check local storage again in case of manual override during runtime
      const manualOverride = localStorage.getItem(`flag_${flagName}`);
      if (manualOverride !== null) {
        setEnabled(manualOverride === "true");
      }
    };

    checkRemoteFlag();
  }, [flagName]);

  return enabled;
};
