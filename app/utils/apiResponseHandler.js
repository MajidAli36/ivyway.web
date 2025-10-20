/**
 * API Response Handler Utility
 * Handles different API response structures and ensures data is always in expected format
 */

/**
 * Extracts array data from API response
 * @param {Object} response - API response object
 * @param {string} dataKey - Key to look for in response.data (optional)
 * @returns {Array} Array of data items
 */
export function extractArrayData(response, dataKey = null) {
  if (!response || !response.data) {
    console.warn("No response or response.data found");
    return [];
  }

  const responseData = response.data;
  
  // If dataKey is specified, look for that key first
  if (dataKey && responseData[dataKey] && Array.isArray(responseData[dataKey])) {
    console.log(`Using response.data.${dataKey}`);
    return responseData[dataKey];
  }

  // Check if response.data is directly an array
  if (Array.isArray(responseData)) {
    console.log("Using response.data directly");
    return responseData;
  }

  // Check common array property names
  const commonArrayKeys = ['data', 'items', 'results', 'list', 'records'];
  for (const key of commonArrayKeys) {
    if (responseData[key] && Array.isArray(responseData[key])) {
      console.log(`Using response.data.${key}`);
      return responseData[key];
    }
  }

  // If no array found, log the structure for debugging
  console.warn("No array data found in response. Available keys:", Object.keys(responseData));
  return [];
}

/**
 * Extracts single object data from API response
 * @param {Object} response - API response object
 * @param {string} dataKey - Key to look for in response.data (optional)
 * @returns {Object|null} Object data or null
 */
export function extractObjectData(response, dataKey = null) {
  if (!response || !response.data) {
    console.warn("No response or response.data found");
    return null;
  }

  const responseData = response.data;
  
  // If dataKey is specified, look for that key first
  if (dataKey && responseData[dataKey]) {
    console.log(`Using response.data.${dataKey}`);
    return responseData[dataKey];
  }

  // Return response.data if it's an object
  if (typeof responseData === 'object' && !Array.isArray(responseData)) {
    console.log("Using response.data directly");
    return responseData;
  }

  console.warn("No object data found in response");
  return null;
}

/**
 * Safely handles API errors and provides user-friendly messages
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @returns {string} User-friendly error message
 */
export function handleApiError(error, defaultMessage = "An error occurred") {
  console.error("API Error:", error);
  console.error("Error type:", typeof error);
  console.error("Error keys:", error ? Object.keys(error) : "No keys");
  
  // Handle empty or malformed error objects
  if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) {
    console.error("Empty or malformed error object detected");
    return "Unknown error occurred. Please try again.";
  }
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    console.error("Server error response:", {
      status,
      message,
      data: error.response.data
    });
    
    switch (status) {
      case 400:
        return message || "Invalid request. Please check your input.";
      case 401:
        return "Please log in to continue.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return message || "This action conflicts with existing data.";
      case 422:
        return message || "Please check your input and try again.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return message || `Server error (${status}). Please try again.`;
    }
  } else if (error.request) {
    // Network error
    console.error("Network error:", error.request);
    return "Network error. Please check your connection and try again.";
  } else if (error.message) {
    // Other error with message
    console.error("Other error:", error.message);
    return error.message;
  } else {
    // Fallback for unknown errors
    console.error("Unknown error type:", error);
    return defaultMessage;
  }
}

/**
 * Validates that data is an array and provides fallback
 * @param {any} data - Data to validate
 * @returns {Array} Validated array
 */
export function ensureArray(data) {
  if (Array.isArray(data)) {
    return data;
  }
  console.warn("Data is not an array, returning empty array:", typeof data);
  return [];
}

/**
 * Validates that data is an object and provides fallback
 * @param {any} data - Data to validate
 * @returns {Object|null} Validated object or null
 */
export function ensureObject(data) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data;
  }
  console.warn("Data is not an object, returning null:", typeof data);
  return null;
}

/**
 * Creates a safe API call wrapper that handles errors and data extraction
 * @param {Function} apiCall - API call function
 * @param {Object} options - Options for the wrapper
 * @returns {Promise<Object>} Promise with standardized response
 */
export async function safeApiCall(apiCall, options = {}) {
  const {
    extractArray = false,
    dataKey = null,
    defaultData = [],
    errorMessage = "An error occurred"
  } = options;

  try {
    const response = await apiCall();
    
    if (extractArray) {
      const data = extractArrayData(response, dataKey);
      return {
        success: true,
        data: data,
        error: null
      };
    } else {
      const data = extractObjectData(response, dataKey);
      return {
        success: true,
        data: data,
        error: null
      };
    }
  } catch (error) {
    const processedErrorMessage = handleApiError(error, errorMessage);
    return {
      success: false,
      data: defaultData,
      error: processedErrorMessage
    };
  }
}
