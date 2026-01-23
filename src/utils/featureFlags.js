import { useState, useEffect } from 'react';
import { DEFAULT_FEATURE_FLAGS, STORAGE_KEYS } from './constants';

/**
 * Feature Flags
 * Centralized feature flag management with remote toggle capability
 */

export const FLAGS = {
  LANDING_3D: 'landing_3d_enabled',
  DARK_MODE: 'dark_mode_enabled',
  VOICE_ASSISTANT: 'voice_assistant_enabled',
  MEDICATION_REMINDERS: 'medication_reminders_enabled',
  REAL_TIME_UPDATES: 'real_time_updates_enabled',
  OFFLINE_MODE: 'offline_mode_enabled',
};

/**
 * Get feature flag value from localStorage
 * @param {string} flagName - Flag name from FLAGS constant
 * @param {boolean} defaultValue - Default value if not found
 * @returns {boolean} Flag value
 */
export const getFeatureFlag = (flagName, defaultValue = false) => {
  try {
    const stored = localStorage.getItem(`flag_${flagName}`);
    return stored !== null ? stored === 'true' : defaultValue;
  } catch (error) {
    console.error(`[FeatureFlags] Error reading flag ${flagName}:`, error);
    return defaultValue;
  }
};

/**
 * Set feature flag value in localStorage
 * @param {string} flagName - Flag name from FLAGS constant
 * @param {boolean} value - Flag value
 */
export const setFeatureFlag = (flagName, value) => {
  try {
    localStorage.setItem(`flag_${flagName}`, String(value));
    console.log(`[FeatureFlags] Set ${flagName} = ${value}`);
  } catch (error) {
    console.error(`[FeatureFlags] Error setting flag ${flagName}:`, error);
  }
};

/**
 * Fetch feature flag from backend (for remote toggle capability)
 * @param {string} flagName - Flag name
 * @returns {Promise<boolean>} Flag value from backend
 */
export const fetchFeatureFlagFromBackend = async (flagName) => {
  try {
    // In production: Replace with actual API endpoint
    const response = await fetch(`/api/features/${flagName}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.enabled;
  } catch (error) {
    console.warn(`[FeatureFlags] Failed to fetch ${flagName} from backend:`, error.message);
    return null; // Return null to indicate fetch failure
  }
};

/**
 * React hook for feature flags with remote sync
 * @param {string} flagName - Flag name from FLAGS constant
 * @param {boolean} defaultValue - Default value if not found
 * @returns {boolean} Current flag value
 */
export const useFeatureFlag = (flagName, defaultValue = false) => {
  const [enabled, setEnabled] = useState(() => {
    return getFeatureFlag(flagName, defaultValue);
  });
  
  useEffect(() => {
    // Fetch from backend on mount (optional - for remote toggle)
    const syncFromBackend = async () => {
      const backendValue = await fetchFeatureFlagFromBackend(flagName);
      
      if (backendValue !== null) {
        setEnabled(backendValue);
        setFeatureFlag(flagName, backendValue); // Cache locally
      }
    };
    
    // Uncomment to enable backend sync
    // syncFromBackend();
  }, [flagName]);
  
  return enabled;
};

/**
 * Get all feature flags
 * @returns {Object} Object with all flag values
 */
export const getAllFeatureFlags = () => {
  const flags = {};
  
  Object.entries(FLAGS).forEach(([key, flagName]) => {
    flags[key] = getFeatureFlag(flagName, DEFAULT_FEATURE_FLAGS[key.toUpperCase()]);
  });
  
  return flags;
};

/**
 * Reset all feature flags to defaults
 */
export const resetFeatureFlags = () => {
  Object.entries(FLAGS).forEach(([key, flagName]) => {
    const defaultValue = DEFAULT_FEATURE_FLAGS[key.toUpperCase()];
    setFeatureFlag(flagName, defaultValue);
  });
  
  console.log('[FeatureFlags] Reset all flags to defaults');
};

/**
 * Feature flag admin panel helper (for development)
 * @returns {Object} Admin functions
 */
export const featureFlagAdmin = () => {
  return {
    list: getAllFeatureFlags,
    get: getFeatureFlag,
    set: setFeatureFlag,
    reset: resetFeatureFlags,
    
    // Enable all features (for testing)
    enableAll: () => {
      Object.values(FLAGS).forEach(flag => setFeatureFlag(flag, true));
      console.log('[FeatureFlags] Enabled all flags');
    },
    
    // Disable all features (for testing)
    disableAll: () => {
      Object.values(FLAGS).forEach(flag => setFeatureFlag(flag, false));
      console.log('[FeatureFlags] Disabled all flags');
    },
  };
};

// Expose admin to window in development
if (process.env.NODE_ENV === 'development') {
  window.featureFlags = featureFlagAdmin();
  console.log('[FeatureFlags] Admin available at window.featureFlags');
}
