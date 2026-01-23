import { DATE_FORMATS } from './constants';

/**
 * Formatting Utilities
 * Data formatting for display in healthcare context
 */

/**
 * Format date for display
 * @param {string | Date} date - Date to format
 * @param {string} format - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  // Simple format implementation (for production, use date-fns or similar)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  if (format === DATE_FORMATS.DISPLAY) {
    return `${month} ${day}, ${year}`;
  } else if (format === DATE_FORMATS.DISPLAY_WITH_TIME) {
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  } else if (format === DATE_FORMATS.ISO) {
    return d.toISOString().split('T')[0];
  } else if (format === DATE_FORMATS.TIME_ONLY) {
    return `${hours}:${minutes}`;
  }
  
  return d.toLocaleDateString();
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string | Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.floor(Math.abs(diffMs) / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const isPast = diffMs < 0;
  const suffix = isPast ? 'ago' : 'from now';
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ${suffix}`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${suffix}`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${suffix}`;
  
  return formatDate(d);
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length (US format)
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  return phone; // Return as-is if format unknown
};

/**
 * Format currency (for medication prices)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format dosage for display
 * @param {string} dosage - Dosage string
 * @returns {string} Formatted dosage
 */
export const formatDosage = (dosage) => {
  if (!dosage) return '';
  
  // Ensure proper spacing between number and unit
  return dosage.replace(/(\d+)([a-zA-Z]+)/, '$1 $2');
};

/**
 * Format order status for display
 * @param {string} status - Order status
 * @returns {string} Formatted status
 */
export const formatOrderStatus = (status) => {
  if (!status) return '';
  
  // Convert snake_case to Title Case
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format medication frequency for display
 * @param {string} frequency - Frequency code
 * @returns {string} Human-readable frequency
 */
export const formatMedicationFrequency = (frequency) => {
  const frequencies = {
    once_daily: 'Once daily',
    twice_daily: 'Twice daily',
    three_times_daily: '3 times daily',
    four_times_daily: '4 times daily',
    as_needed: 'As needed',
    weekly: 'Weekly',
  };
  
  return frequencies[frequency] || frequency;
};

/**
 * Format percentage
 * @param {number} value - Value to format (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, isDecimal = true) => {
  if (value === null || value === undefined) return '';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${Math.round(percentage)}%`;
};

/**
 * Format list of items with proper grammar
 * @param {Array<string>} items - Items to format
 * @param {string} conjunction - Conjunction to use (default: 'and')
 * @returns {string} Formatted list
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  
  return `${otherItems}, ${conjunction} ${lastItem}`;
};

/**
 * Format time duration
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0 seconds';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};
