/**
 * Utility functions for handling profile images
 */

/**
 * Get the default avatar URL
 * @returns {string} - Default avatar URL
 */
export const getDefaultAvatar = () => {
  return "/default-avatar.png";
};

/**
 * Handle profile image error by setting fallback
 * @param {Event} e - Error event
 */
export const handleProfileImageError = (e) => {
  e.target.src = getDefaultAvatar();
};

/**
 * Build a full URL for images that may be returned as relative paths
 * - If already absolute (http/https), return as is
 * - If path starts with /uploads or /, prefix API base
 * - Otherwise, return as is
 *
 * The API base comes from NEXT_PUBLIC_API_BASE_URL, with a sane default.
 * @param {string} path
 * @returns {string}
 */
export const getFullImageUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ivyway-backend-iu4z.onrender.com/api";

  if (path.startsWith("/uploads/")) return `${API_BASE}${path}`;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
};

/**
 * Get profile image URL with fallback
 * @param {string} imageUrl - Original image URL (absolute or relative)
 * @returns {string} - Resolved image URL or default avatar
 */
export const getProfileImageUrl = (imageUrl) => {
  const resolved = getFullImageUrl(imageUrl);
  return resolved || getDefaultAvatar();
};
