/**
 * Application Constants
 * Centralized constants for roles, statuses, and configuration
 */

// User Roles
export const ROLES = {
  PATIENT: 'patient',
  PHARMACY: 'pharmacy',
  DELIVERY: 'delivery',
};

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  READY: 'ready',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Order Status Labels (for display)
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending Approval',
  [ORDER_STATUS.APPROVED]: 'Approved',
  [ORDER_STATUS.READY]: 'Ready for Pickup',
  [ORDER_STATUS.IN_TRANSIT]: 'In Transit',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

// Order Status Colors (Tailwind classes)
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ORDER_STATUS.APPROVED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ORDER_STATUS.READY]: 'bg-green-100 text-green-800 border-green-200',
  [ORDER_STATUS.IN_TRANSIT]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ORDER_STATUS.DELIVERED]: 'bg-gray-100 text-gray-800 border-gray-200',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
};

// Medication Frequencies
export const MEDICATION_FREQUENCY = {
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  AS_NEEDED: 'as_needed',
  WEEKLY: 'weekly',
};

// Medication Frequency Labels
export const MEDICATION_FREQUENCY_LABELS = {
  [MEDICATION_FREQUENCY.ONCE_DAILY]: 'Once daily',
  [MEDICATION_FREQUENCY.TWICE_DAILY]: 'Twice daily',
  [MEDICATION_FREQUENCY.THREE_TIMES_DAILY]: '3 times daily',
  [MEDICATION_FREQUENCY.FOUR_TIMES_DAILY]: '4 times daily',
  [MEDICATION_FREQUENCY.AS_NEEDED]: 'As needed',
  [MEDICATION_FREQUENCY.WEEKLY]: 'Weekly',
};

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PREFERENCES: '/api/user/preferences',
    UPDATE_ADDRESSES: '/api/user/addresses',
  },
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    UPDATE_STATUS: '/api/orders/:id/status',
    CANCEL: '/api/orders/:id/cancel',
  },
  MEDICATIONS: {
    LIST: '/api/medications',
    SEARCH: '/api/medications/search',
    DETAILS: '/api/medications/:id',
  },
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/:id/read',
    CLEAR: '/api/notifications/clear',
  },
};

// Feature Flags (default values)
export const DEFAULT_FEATURE_FLAGS = {
  LANDING_3D_ENABLED: true,
  DARK_MODE_ENABLED: true,
  VOICE_ASSISTANT_ENABLED: false,
  MEDICATION_REMINDERS_ENABLED: true,
  REAL_TIME_UPDATES_ENABLED: false,
  OFFLINE_MODE_ENABLED: false,
};

// Accessibility Settings
export const ACCESSIBILITY = {
  MIN_FONT_SIZE_MULTIPLIER: 0.8,
  MAX_FONT_SIZE_MULTIPLIER: 1.5,
  DEFAULT_FONT_SIZE_MULTIPLIER: 1.0,
  
  // WCAG 2.1 AA Contrast Ratios
  MIN_CONTRAST_RATIO_NORMAL: 4.5,
  MIN_CONTRAST_RATIO_LARGE: 3.0,
  MIN_CONTRAST_RATIO_AAA: 7.0,
};

// Performance Settings
export const PERFORMANCE = {
  FPS_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 45,
    HIGH: 55,
  },
  
  QUALITY_PRESETS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    DISABLED: 'disabled',
  },
  
  // Bundle size targets (KB)
  BUNDLE_SIZE_TARGETS: {
    INITIAL: 450,
    THREEJS_CHUNK: 750,
    TOTAL: 1200,
  },
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  
  DOSAGE_PATTERN: /^\d+(\.\d+)?\s*(mg|g|ml|mcg|IU)$/i,
  PHONE_PATTERN: /^[\d\s\-+()]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'medilink-theme',
  AUTH: 'medilink-auth',
  FEATURE_FLAGS: 'medilink-feature-flags',
  LANDING_SEEN: 'medilink_landing_seen',
};

// Session Storage Keys (for temporary data)
export const SESSION_KEYS = {
  TEMP_ORDER: 'medilink-temp-order',
  SEARCH_HISTORY: 'medilink-search-history',
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to access this resource',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_DOSAGE: 'Please enter a valid dosage (e.g., 500mg, 10ml)',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    PASSWORD_REQUIREMENTS: 'Password must contain uppercase, lowercase, number, and special character',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Unable to connect to server. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'You have been logged out successfully',
  },
  ORDER: {
    CREATED: 'Order created successfully',
    UPDATED: 'Order updated successfully',
    CANCELLED: 'Order cancelled successfully',
  },
  PROFILE: {
    UPDATED: 'Profile updated successfully',
  },
};

// Time Constants (milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  
  // Debounce/Throttle
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_INPUT: 500,
  THROTTLE_SCROLL: 100,
  
  // Timeouts
  API_TIMEOUT: 30 * 1000, // 30 seconds
  NOTIFICATION_AUTO_DISMISS: 5 * 1000, // 5 seconds
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm',
};
