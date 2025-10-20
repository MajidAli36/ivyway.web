/**
 * Extracts initials from a name
 * @param {string} name - The full name to extract initials from
 * @param {number} maxChars - Maximum number of characters to return (default: 2)
 * @returns {string} The initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name, maxChars = 2) {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .filter(char => char.length > 0)
    .slice(0, maxChars)
    .join('')
    .toUpperCase();
}

/**
 * Format a date relative to now (e.g., "today", "yesterday", "2 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative date
 */
export function formatRelativeDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now - dateObj);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return dateObj.toLocaleDateString();
  }
}

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string with ellipsis if needed
 */
export function truncateString(str, length = 30) {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return str.substring(0, length) + '...';
}

/**
 * Format a file size in bytes to a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Create a unique ID for temporary use (not for security purposes)
 * @returns {string} A unique ID
 */
export function generateTempId() {
  return 'temp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}