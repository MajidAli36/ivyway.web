import { API_CONFIG } from '../../../lib/api/config';

/**
 * Generic API call function with authentication
 * @param {string} endpoint - API endpoint to call
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body data (optional)
 * @param {object} customConfig - Custom fetch config (optional)
 * @returns {Promise} Response data
 */
export async function apiCall(endpoint, method = 'GET', data = null, customConfig = {}) {
  try {
    // Get JWT token from localStorage directly
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;

    if (!token) {
      throw new Error('Please sign in to continue');
    }

    // Use API_CONFIG.baseURL instead of hardcoded URL
    const url = `${API_CONFIG.baseURL}/${endpoint}`;

    const config = {
      method,
      headers: {
        ...API_CONFIG.headers, // Use headers from API_CONFIG
        Authorization: `Bearer ${token}`,
        ...customConfig.headers,
      },
      ...customConfig,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
        }
        window.location.href = '/login'; // Redirect to login
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Convenience methods for different HTTP methods
export const apiGet = (endpoint, customConfig = {}) => apiCall(endpoint, 'GET', null, customConfig);

export const apiPost = (endpoint, data, customConfig = {}) => apiCall(endpoint, 'POST', data, customConfig);

export const apiPut = (endpoint, data, customConfig = {}) => apiCall(endpoint, 'PUT', data, customConfig);

export const apiDelete = (endpoint, customConfig = {}) => apiCall(endpoint, 'DELETE', null, customConfig);
