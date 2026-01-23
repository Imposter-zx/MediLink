import { create } from 'zustand';

/**
 * User Store - Manages user profile data separate from authentication
 * 
 * SECURITY NOTE: This store should be populated from backend API calls.
 * Never store PHI/PII in localStorage. All sensitive data should come from
 * encrypted backend database and exist only in memory during the session.
 */
export const useUserStore = create((set, get) => ({
  // User profile data (fetched from backend after authentication)
  profile: null, // { medicalHistory, allergies, preferences, addresses, emergencyContacts }
  
  /**
   * Set complete user profile (called after successful login)
   * @param {Object} profileData - User profile from backend API
   */
  setProfile: (profileData) => set({ profile: profileData }),
  
  /**
   * Update user preferences (theme, notifications, etc.)
   * @param {Object} preferences - Preference updates
   */
  updatePreferences: (preferences) => set((state) => ({
    profile: state.profile ? {
      ...state.profile,
      preferences: { ...state.profile.preferences, ...preferences }
    } : null
  })),
  
  /**
   * Update delivery addresses
   * @param {Array} addresses - Updated address list
   */
  updateAddresses: (addresses) => set((state) => ({
    profile: state.profile ? { ...state.profile, addresses } : null
  })),
  
  /**
   * Clear all profile data (called on logout)
   */
  clearProfile: () => set({ profile: null }),
  
  /**
   * Get user preference by key
   * @param {string} key - Preference key
   * @returns {any} Preference value or null
   */
  getPreference: (key) => {
    const state = get();
    return state.profile?.preferences?.[key] ?? null;
  },
  
  /**
   * Check if user has allergies
   * @returns {boolean}
   */
  hasAllergies: () => {
    const state = get();
    return state.profile?.allergies?.length > 0;
  },
}));
