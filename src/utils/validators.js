import { VALIDATION, ERROR_MESSAGES } from './constants';

/**
 * Validation Utilities
 * Input validation for healthcare data with security focus
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  if (!VALIDATION.EMAIL_PATTERN.test(email)) {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_EMAIL };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  if (!VALIDATION.PHONE_PATTERN.test(phone)) {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_PHONE };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate medication dosage
 * @param {string} dosage - Dosage to validate (e.g., "500mg", "10ml")
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateDosage = (dosage) => {
  if (!dosage || dosage.trim() === '') {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  if (!VALIDATION.DOSAGE_PATTERN.test(dosage)) {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_DOSAGE };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, error: string | null, strength: number }
 */
export const validatePassword = (password) => {
  if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return { 
      valid: false, 
      error: ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT,
      strength: 0,
    };
  }
  
  let strength = 0;
  const checks = {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  // Calculate strength (0-4)
  strength = Object.values(checks).filter(Boolean).length;
  
  // Check requirements
  const meetsRequirements = 
    (!VALIDATION.PASSWORD_REQUIRE_UPPERCASE || checks.hasUppercase) &&
    (!VALIDATION.PASSWORD_REQUIRE_LOWERCASE || checks.hasLowercase) &&
    (!VALIDATION.PASSWORD_REQUIRE_NUMBER || checks.hasNumber) &&
    (!VALIDATION.PASSWORD_REQUIRE_SPECIAL || checks.hasSpecial);
  
  if (!meetsRequirements) {
    return {
      valid: false,
      error: ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIREMENTS,
      strength,
    };
  }
  
  return { valid: true, error: null, strength };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateRequired = (value) => {
  const isEmpty = 
    value === null || 
    value === undefined || 
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);
  
  if (isEmpty) {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  return { valid: true, error: null };
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and script content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

/**
 * Validate medication name (alphanumeric with spaces and hyphens)
 * @param {string} name - Medication name
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateMedicationName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  // Allow letters, numbers, spaces, hyphens, and parentheses
  const pattern = /^[a-zA-Z0-9\s\-\(\)]+$/;
  
  if (!pattern.test(name)) {
    return { valid: false, error: 'Medication name contains invalid characters' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate date (must be in the future for appointments)
 * @param {string} dateString - Date string to validate
 * @param {boolean} mustBeFuture - Whether date must be in the future
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateDate = (dateString, mustBeFuture = false) => {
  if (!dateString) {
    return { valid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (mustBeFuture && date < new Date()) {
    return { valid: false, error: 'Date must be in the future' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate form data with multiple fields
 * @param {Object} data - Form data object
 * @param {Object} rules - Validation rules { fieldName: validatorFunction }
 * @returns {Object} { valid: boolean, errors: Object }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let valid = true;
  
  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field]);
    
    if (!result.valid) {
      errors[field] = result.error;
      valid = false;
    }
  });
  
  return { valid, errors };
};

/**
 * Example usage of validateForm:
 * 
 * const formData = {
 *   email: 'user@example.com',
 *   password: 'SecurePass123!',
 *   medication: 'Aspirin',
 *   dosage: '500mg',
 * };
 * 
 * const rules = {
 *   email: validateEmail,
 *   password: validatePassword,
 *   medication: validateMedicationName,
 *   dosage: validateDosage,
 * };
 * 
 * const { valid, errors } = validateForm(formData, rules);
 */
