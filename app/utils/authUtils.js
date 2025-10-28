// Utility function to handle authentication errors consistently
import { dispatchSessionExpiredEvent } from "./pageUtils";

export const handleAuthError = (error, authService) => {
  const status = error?.response?.status || error?.status;
  const message = error?.response?.data?.message || error?.message || "";

  // Handle session expiration
  if (status === 401) {
    // Clear invalid tokens
    authService.logout();
    
    // Dispatch session expired event to show modal (only if not on auth pages)
    dispatchSessionExpiredEvent(
      message.includes("expired") || message.includes("session") 
        ? message 
        : "Your session has expired. Please sign in again."
    );
    
    return {
      isSessionExpired: true,
      message: message.includes("expired") || message.includes("session") 
        ? message 
        : "Your session has expired. Please sign in again."
    };
  }

  // Handle other authentication/authorization errors
  if (status === 403) {
    return {
      isSessionExpired: false,
      message: "You don't have permission to perform this action."
    };
  }

  // Handle other errors
  return {
    isSessionExpired: false,
    message: message || "An error occurred. Please try again."
  };
};

// Utility function to check if user is authenticated
export const checkAuthentication = (authService) => {
  const token = authService.getToken();
  const user = authService.getUser();
  
  if (!token || !user) {
    return false;
  }

  // Optional: Check if token is expired (basic check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      // Token is expired
      authService.logout();
      return false;
    }
  } catch (error) {
    // Invalid token format
    authService.logout();
    return false;
  }

  return true;
};

export default {
  handleAuthError,
  checkAuthentication
};
