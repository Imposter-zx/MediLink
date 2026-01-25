import { ROLES } from './constants';

/**
 * Permission Definitions
 * Maps permissions to allowed roles
 */
export const PERMISSIONS = {
  // Order Management
  VIEW_ORDERS: [ROLES.PATIENT, ROLES.PHARMACY, ROLES.DELIVERY],
  CREATE_ORDER: [ROLES.PATIENT],
  APPROVE_ORDER: [ROLES.PHARMACY],
  CANCEL_ORDER: [ROLES.PATIENT, ROLES.PHARMACY],
  DELIVER_ORDER: [ROLES.DELIVERY],
  
  // Medication Management
  VIEW_MEDICATIONS: [ROLES.PATIENT, ROLES.PHARMACY],
  MANAGE_INVENTORY: [ROLES.PHARMACY],
  PRESCRIBE_MEDICATION: [ROLES.PHARMACY],
  
  // User Management
  VIEW_PROFILE: [ROLES.PATIENT, ROLES.PHARMACY, ROLES.DELIVERY],
  EDIT_PROFILE: [ROLES.PATIENT, ROLES.PHARMACY, ROLES.DELIVERY],
  VIEW_MEDICAL_HISTORY: [ROLES.PATIENT, ROLES.PHARMACY],
  
  // Dashboard Access
  ACCESS_PATIENT_DASHBOARD: [ROLES.PATIENT],
  ACCESS_PHARMACY_DASHBOARD: [ROLES.PHARMACY],
  ACCESS_DELIVERY_DASHBOARD: [ROLES.DELIVERY],
  
  // Notifications
  SEND_NOTIFICATIONS: [ROLES.PHARMACY, ROLES.DELIVERY],
  RECEIVE_NOTIFICATIONS: [ROLES.PATIENT, ROLES.PHARMACY, ROLES.DELIVERY],
  
  // Reports
  VIEW_REPORTS: [ROLES.PHARMACY],
  EXPORT_REPORTS: [ROLES.PHARMACY],
};

/**
 * Check if a user role has a specific permission
 * @param {string} userRole - User's role (from ROLES constant)
 * @param {string} permission - Permission to check (from PERMISSIONS constant)
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) {
    console.warn('[Permissions] Invalid role or permission:', { userRole, permission });
    return false;
  }
  
  const allowedRoles = PERMISSIONS[permission];
  
  if (!allowedRoles) {
    console.warn(`[Permissions] Unknown permission: ${permission}`);
    return false;
  }
  
  return allowedRoles.includes(userRole);
};

/**
 * Check if a user role can access a specific route
 * @param {string} userRole - User's role
 * @param {string} route - Route path
 * @returns {boolean} True if user can access route
 */
export const canAccessRoute = (userRole, route) => {
  const routePermissions = {
    '/patient': PERMISSIONS.ACCESS_PATIENT_DASHBOARD,
    '/pharmacy': PERMISSIONS.ACCESS_PHARMACY_DASHBOARD,
    '/delivery': PERMISSIONS.ACCESS_DELIVERY_DASHBOARD,
    '/library': [ROLES.PATIENT, ROLES.PHARMACY, ROLES.DELIVERY], // Public to all authenticated
  };
  
  const allowedRoles = routePermissions[route];
  
  if (!allowedRoles) {
    // Route not in permission map - allow by default (e.g., home page)
    return true;
  }
  
  return allowedRoles.includes(userRole);
};

/**
 * Get all permissions for a specific role
 * @param {string} userRole - User's role
 * @returns {Array<string>} Array of permission names
 */
export const getPermissionsForRole = (userRole) => {
  return Object.entries(PERMISSIONS)
    .filter(([, allowedRoles]) => allowedRoles.includes(userRole))
    .map(([permission]) => permission);
};

/**
 * Check multiple permissions at once
 * @param {string} userRole - User's role
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean} True if user has ALL permissions
 */
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has at least one of the specified permissions
 * @param {string} userRole - User's role
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean} True if user has ANY of the permissions
 */
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Audit log for permission checks (for compliance)
 * @param {string} userId - User ID
 * @param {string} userRole - User's role
 * @param {string} permission - Permission being checked
 * @param {boolean} granted - Whether permission was granted
 */
export const auditPermissionCheck = (userId, userRole, permission, granted) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId,
    userRole,
    permission,
    granted,
    userAgent: navigator.userAgent,
  };
  
  // In production: Send to backend logging service
  if (import.meta.env.PROD) {
    // fetch('/api/audit/permissions', {
    //   method: 'POST',
    //   body: JSON.stringify(logEntry),
    // });
  }
  
  // Development logging
  if (!granted) {
    console.warn('[RBAC Audit] Permission denied:', logEntry);
  } else {
    console.log('[RBAC Audit] Permission granted:', logEntry);
  }
};
