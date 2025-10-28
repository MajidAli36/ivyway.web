import { API_CONFIG } from "./config";
import { dispatchSessionExpiredEvent } from "@/app/utils/pageUtils";

class ApiClient {
  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.headers = config.headers;
  }

  // Get JWT token from localStorage
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Set Content-Type for all requests with a body
      let requestHeaders = { ...this.headers };

      if (options.body) {
        requestHeaders = {
          ...requestHeaders,
          "Content-Type": "application/json",
        };
      }

      // Add any custom headers
      requestHeaders = { ...requestHeaders, ...options.headers };

      // Add JWT auth token
      const token = this.getAuthToken();
      if (token) {
        requestHeaders = {
          ...requestHeaders,
          Authorization: `Bearer ${token}`,
        };
      }

      // Log details in development
      if (process.env.NODE_ENV === "development") {
        console.log(`API Request: ${options.method || "GET"} ${url}`);
        console.log("Headers:", requestHeaders);
        if (options.body) console.log("Body:", options.body);
      }

      // Make the request
      const response = await fetch(url, {
        ...options,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Get response data
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Log response in development
      if (process.env.NODE_ENV === "development") {
        console.log(`API Response (${response.status}):`, data);
      }

      // Handle errors
      if (!response.ok) {
        // Special handling for auth errors
        if (response.status === 401) {
          console.error("Authentication error:", data);
          // Clear invalid tokens and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user");
            
            // Only dispatch session expired event if not on auth pages
            dispatchSessionExpiredEvent(data.message || "Your session has expired. Please sign in again.");
          }
        } else if (response.status === 403) {
          console.error("Authorization error:", data);
        }

        throw {
          status: response.status,
          message: data.message || response.statusText,
          errors: data.errors || null,
          data,
          response,
        };
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw {
          status: 408,
          message: "Request timeout",
          errors: null,
        };
      }

      // Handle CORS errors specifically
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        // Check if this is likely a CORS error
        if (
          error.message.includes("CORS") ||
          error.message.includes("Access-Control-Allow-Origin") ||
          error.message.includes("blocked by CORS policy")
        ) {
          throw {
            status: 0,
            message:
              "CORS Error: Backend server CORS configuration needs to be updated. Please contact the administrator.",
            errors: null,
            isCorsError: true,
            originalError: error,
          };
        }
      }

      throw error;
    }
  }

  async get(endpoint, params = {}) {
    // Handle nested objects properly for URLSearchParams
    const flattenedParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        flattenedParams[key] = params[key];
      }
    });

    const queryString = new URLSearchParams(flattenedParams).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: "GET",
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
