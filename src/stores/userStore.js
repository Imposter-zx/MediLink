import { create } from 'zustand';

/**
 * User Store - Manages detailed user profile data
 * 
 * Separates sensitive profile data (medical history, preferences)
 * from the core authentication state (authStore).
 * 
 * Data Flow:
 * 1. authStore handles login/token
 * 2. Component calls backend to fetch profile
 * 3. Profile data stored here (memory only)
 */
export const useUserStore = create((set) => ({
  profile: null, // { medicalHistory, allergies, preferences, addresses }

  setProfile: (profileData) => set({ profile: profileData }),

  updatePreferences: (prefs) =>
    set((state) => ({
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, ...prefs },
      },
    })),

  clearProfile: () => set({ profile: null }),
}));
