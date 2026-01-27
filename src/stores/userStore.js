import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * User Store - Manages detailed user profile data
 * 
 * Separates sensitive profile data (medical history, preferences)
 * from the core authentication state (authStore).
 * 
 * Data Flow:
 * 1. authStore handles login/token
 * 2. Component calls backend to fetch profile
 * 3. Profile data stored here (persisted to localStorage for demo)
 */
export const useUserStore = create(
  persist(
    (set) => ({
      profile: null, // { medicalHistory, allergies, preferences, addresses }

      // Medical preferences
      medicalPreferences: {
        preferredPharmacy: null,
        deliveryAddress: null,
        allergies: [],
        chronicConditions: [],
      },

      // Notification preferences
      notificationPreferences: {
        medicationReminders: true,
        deliveryUpdates: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
      },

      // Privacy settings
      privacySettings: {
        shareDataWithPharmacy: true,
        shareDataForResearch: false,
        allowMarketing: false,
      },

      setProfile: (profileData) => set({ profile: profileData }),

      updatePreferences: (prefs) =>
        set((state) => ({
          profile: {
            ...state.profile,
            preferences: { ...state.profile?.preferences, ...prefs },
          },
        })),

      updateMedicalPreferences: (prefs) =>
        set((state) => ({
          medicalPreferences: { ...state.medicalPreferences, ...prefs },
        })),

      updateNotificationPreferences: (prefs) =>
        set((state) => ({
          notificationPreferences: { ...state.notificationPreferences, ...prefs },
        })),

      updatePrivacySettings: (settings) =>
        set((state) => ({
          privacySettings: { ...state.privacySettings, ...settings },
        })),

      clearProfile: () =>
        set({
          profile: null,
          medicalPreferences: {
            preferredPharmacy: null,
            deliveryAddress: null,
            allergies: [],
            chronicConditions: [],
          },
          notificationPreferences: {
            medicationReminders: true,
            deliveryUpdates: true,
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
          },
          privacySettings: {
            shareDataWithPharmacy: true,
            shareDataForResearch: false,
            allowMarketing: false,
          },
        }),
    }),
    {
      name: 'medilink-user-profile',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
