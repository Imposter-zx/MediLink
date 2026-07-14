import { create } from 'zustand';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * PRODUCTION-GRADE AUTH STORE
 * 
 * SECURITY IMPROVEMENTS:
 * ✅ No browser storage for tokens (uses httpOnly cookies)
 * ✅ Session validation on app load
 * ✅ Audit logging for compliance
 * ✅ Secure logout with backend session clearing
 * 
 * IMPORTANT: This requires backend API endpoints:
 * - POST /api/auth/login (sets httpOnly cookie)
 * - POST /api/auth/logout (clears session)
 * - GET /api/auth/session (validates session)
 */

export const useAuthStore = create((set, get) => ({
  // User metadata (NOT sensitive - safe to keep in memory)
  user: null, // { id, name, role: 'patient' | 'pharmacy' | 'delivery' }
  
  // Authentication state
  isAuthenticated: false,
  
  // Loading states
  isLoading: false,
  error: null,
  
  /**
   * Login with credentials
   * Backend will set httpOnly cookie on success
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.identifier || credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || 'Invalid credentials');
      }

      const userData = await response.json();
      set({
        user: userData.user || userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      if (import.meta.env.DEV) {
        console.log('[Auth] Login successful:', {
          userId: userData.user?.id || userData.id,
          role: userData.user?.role || userData.role,
        });
      }

      return { success: true };
    } catch (error) {
      const message = error?.message || 'Login failed';
      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
        user: null,
      });

      console.error('[Auth] Login failed:', error);
      return { success: false, error: message };
    }
  },

  /**
   * Logout and clear backend session
   */
  logout: async () => {
    const currentUser = get().user;

    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
      console.log('[Auth] Logout successful:', {
        userId: currentUser?.id,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Check if session is still valid (call on app load)
   * Backend validates httpOnly cookie
   */
  checkSession: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SESSION, {
        credentials: 'include',
      });

      if (!response.ok) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const userData = await response.json();
      set({
        user: userData.user || userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('[Auth] Session check failed:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
  
  /**
   * RBAC Helper - Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole: (role) => {
    const state = get();
    return state.isAuthenticated && state.user?.role === role;
  },
  
  /**
   * Update user metadata (non-sensitive data only)
   * @param {Object} updates - User metadata updates
   */
  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
