import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useNotificationsStore } from '../stores/notificationsStore';
import { hasPermission } from '../utils/permissions';

/**
 * Custom hook for authentication with helper functions
 * Wraps authStore with additional utilities
 */
export const useAuth = () => {
  const { user, isAuthenticated, login, logout, checkSession } = useAuthStore();
  const { clearProfile } = useUserStore();
  const { clearAll: clearNotifications } = useNotificationsStore();
  
  /**
   * Enhanced logout that clears all user data
   */
  const handleLogout = async () => {
    await logout();
    clearProfile();
    clearNotifications();
    // Clear any other user-specific state
  };
  
  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const can = (permission) => {
    if (!isAuthenticated || !user) return false;
    return hasPermission(user.role, permission);
  };
  
  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return isAuthenticated && user?.role === role;
  };
  
  /**
   * Check if user is authenticated and has one of the allowed roles
   * @param {Array<string>} allowedRoles - Array of allowed roles
   * @returns {boolean}
   */
  const hasAnyRole = (allowedRoles) => {
    return isAuthenticated && allowedRoles.includes(user?.role);
  };
  
  return {
    user,
    isAuthenticated,
    login,
    logout: handleLogout,
    checkSession,
    can,
    hasRole,
    hasAnyRole,
  };
};
