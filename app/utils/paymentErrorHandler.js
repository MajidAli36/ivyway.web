/**
 * Payment Error Handler
 * Centralized error handling for payment and earnings operations
 */

// Stripe Error Types
export const STRIPE_ERROR_TYPES = {
  CARD_ERROR: 'card_error',
  VALIDATION_ERROR: 'validation_error',
  API_ERROR: 'api_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  INVALID_REQUEST_ERROR: 'invalid_request_error',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  CONNECTION_ERROR: 'connection_error'
};

// API Error Status Codes
export const API_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Handle Stripe payment errors
 * @param {Object} error - Stripe error object
 * @returns {string} User-friendly error message
 */
export const handleStripeError = (error) => {
  if (!error || !error.type) {
    return 'An unexpected payment error occurred. Please try again.';
  }

  switch (error.type) {
    case STRIPE_ERROR_TYPES.CARD_ERROR:
      return handleCardError(error);
    
    case STRIPE_ERROR_TYPES.VALIDATION_ERROR:
      return 'Please check your payment information and try again.';
    
    case STRIPE_ERROR_TYPES.API_ERROR:
      return 'Payment service is temporarily unavailable. Please try again later.';
    
    case STRIPE_ERROR_TYPES.AUTHENTICATION_ERROR:
      return 'Payment authentication failed. Please try again.';
    
    case STRIPE_ERROR_TYPES.INVALID_REQUEST_ERROR:
      return 'Invalid payment request. Please check your information.';
    
    case STRIPE_ERROR_TYPES.RATE_LIMIT_ERROR:
      return 'Too many payment attempts. Please wait a moment and try again.';
    
    case STRIPE_ERROR_TYPES.CONNECTION_ERROR:
      return 'Network error. Please check your internet connection and try again.';
    
    default:
      return error.message || 'An unexpected payment error occurred.';
  }
};

/**
 * Handle Stripe card-specific errors
 * @param {Object} error - Stripe card error object
 * @returns {string} User-friendly error message
 */
const handleCardError = (error) => {
  if (!error.code) {
    return 'Your card was declined. Please try a different payment method.';
  }

  const cardErrorMessages = {
    'card_declined': 'Your card was declined. Please try a different payment method.',
    'expired_card': 'Your card has expired. Please use a different card.',
    'incorrect_cvc': 'Your card\'s security code is incorrect. Please try again.',
    'incorrect_number': 'Your card number is incorrect. Please check and try again.',
    'insufficient_funds': 'Your card has insufficient funds. Please try a different payment method.',
    'invalid_cvc': 'Your card\'s security code is invalid. Please try again.',
    'invalid_expiry_month': 'Your card\'s expiration month is invalid. Please try again.',
    'invalid_expiry_year': 'Your card\'s expiration year is invalid. Please try again.',
    'invalid_number': 'Your card number is invalid. Please check and try again.',
    'lost_card': 'Your card was declined. Please contact your bank.',
    'stolen_card': 'Your card was declined. Please contact your bank.',
    'processing_error': 'An error occurred while processing your card. Please try again.',
    'generic_decline': 'Your card was declined. Please try a different payment method.',
    'do_not_honor': 'Your card was declined. Please try a different payment method.',
    'restricted_card': 'Your card was declined. Please contact your bank.',
    'security_violation': 'Your card was declined due to security reasons. Please contact your bank.',
    'service_not_allowed': 'Your card was declined. Please try a different payment method.',
    'stop_payment_order': 'Your card was declined. Please contact your bank.',
    'testmode_decline': 'Your test card was declined. Please use a different test card.',
    'transaction_not_allowed': 'Your card was declined. Please try a different payment method.',
    'try_again_later': 'Your card was declined. Please try again later.',
    'withdrawal_count_limit_exceeded': 'Your card was declined. Please try again later.'
  };

  return cardErrorMessages[error.code] || error.message || 'Your card was declined. Please try a different payment method.';
};

/**
 * Handle API errors
 * @param {Object} error - API error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (!error || !error.response) {
    return 'Network error. Please check your internet connection and try again.';
  }

  const status = error.response.status;
  const message = error.response.data?.message || 'An error occurred';

  switch (status) {
    case API_ERROR_CODES.BAD_REQUEST:
      return `Invalid request: ${message}`;
    
    case API_ERROR_CODES.UNAUTHORIZED:
      return 'Please log in to continue.';
    
    case API_ERROR_CODES.FORBIDDEN:
      return 'You do not have permission to perform this action.';
    
    case API_ERROR_CODES.NOT_FOUND:
      return 'The requested resource was not found.';
    
    case API_ERROR_CODES.UNPROCESSABLE_ENTITY:
      return `Validation error: ${message}`;
    
    case API_ERROR_CODES.TOO_MANY_REQUESTS:
      return 'Too many requests. Please wait before trying again.';
    
    case API_ERROR_CODES.INTERNAL_SERVER_ERROR:
      return 'Server error. Please try again later.';
    
    case API_ERROR_CODES.SERVICE_UNAVAILABLE:
      return 'Service temporarily unavailable. Please try again later.';
    
    default:
      return `Error ${status}: ${message}`;
  }
};

/**
 * Handle payment validation errors
 * @param {Object} validation - Validation result object
 * @returns {string} User-friendly error message
 */
export const handleValidationError = (validation) => {
  if (!validation || !validation.errors || validation.errors.length === 0) {
    return null;
  }

  return validation.errors.join('. ');
};

/**
 * Handle payout validation errors
 * @param {Object} validation - Payout validation result
 * @returns {Object} Formatted validation result
 */
export const handlePayoutValidationError = (validation) => {
  if (!validation || !validation.errors || validation.errors.length === 0) {
    return { isValid: true, errors: [], warnings: [] };
  }

  const formattedErrors = validation.errors.map(error => {
    // Format common validation errors
    if (error.includes('minimum payout amount')) {
      return 'Minimum payout amount is $10.00';
    }
    if (error.includes('exceeds available balance')) {
      return 'Requested amount exceeds your available balance';
    }
    if (error.includes('below minimum payout')) {
      return 'Requested amount is below the minimum payout of $10.00';
    }
    if (error.includes('Invalid payout type')) {
      return 'Please select a valid payout type';
    }
    return error;
  });

  return {
    isValid: false,
    errors: formattedErrors,
    warnings: validation.warnings || []
  };
};

/**
 * Handle network errors
 * @param {Object} error - Network error object
 * @returns {string} User-friendly error message
 */
export const handleNetworkError = (error) => {
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (error.code === 'TIMEOUT') {
    return 'Request timed out. Please try again.';
  }
  
  if (error.code === 'CONNECTION_REFUSED') {
    return 'Unable to connect to the server. Please try again later.';
  }
  
  return 'Network error. Please check your internet connection and try again.';
};

/**
 * Handle generic errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleGenericError = (error) => {
  if (error.message) {
    return error.message;
  }
  
  if (error.name === 'TypeError') {
    return 'An unexpected error occurred. Please try again.';
  }
  
  if (error.name === 'ReferenceError') {
    return 'An unexpected error occurred. Please refresh the page and try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Main error handler that determines the error type and calls appropriate handler
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred (e.g., 'payment', 'payout', 'api')
 * @returns {string} User-friendly error message
 */
export const handleError = (error, context = 'generic') => {
  console.error(`Error in ${context}:`, error);

  // Handle Stripe errors
  if (error.type && Object.values(STRIPE_ERROR_TYPES).includes(error.type)) {
    return handleStripeError(error);
  }

  // Handle API errors
  if (error.response) {
    return handleApiError(error);
  }

  // Handle network errors
  if (error.code && ['NETWORK_ERROR', 'TIMEOUT', 'CONNECTION_REFUSED'].includes(error.code)) {
    return handleNetworkError(error);
  }

  // Handle validation errors
  if (error.errors && Array.isArray(error.errors)) {
    return handleValidationError(error);
  }

  // Handle generic errors
  return handleGenericError(error);
};

/**
 * Create error object with additional context
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @returns {Object} Error object
 */
export const createError = (message, code = null, details = {}) => {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  error.timestamp = new Date().toISOString();
  return error;
};

/**
 * Log error for debugging
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {Object} additionalInfo - Additional information to log
 */
export const logError = (error, context = 'unknown', additionalInfo = {}) => {
  const errorLog = {
    message: error.message,
    code: error.code,
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack,
    ...additionalInfo
  };

  // In production, you might want to send this to an error tracking service
  console.error('Error Log:', errorLog);
  
  // Example: Send to error tracking service
  // if (process.env.NODE_ENV === 'production') {
  //   errorTrackingService.captureException(error, { extra: errorLog });
  // }
};

export default {
  handleStripeError,
  handleApiError,
  handleValidationError,
  handlePayoutValidationError,
  handleNetworkError,
  handleGenericError,
  handleError,
  createError,
  logError
};
