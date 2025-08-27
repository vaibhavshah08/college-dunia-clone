// Error handling utilities for consistent error management across the application

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  redirectTo?: string;
  clearToken?: boolean;
}

/**
 * Handle API errors consistently across the application
 */
export const handleApiError = (
  error: any, 
  options: ErrorHandlerOptions = {}
): string => {
  const { showToast = true, redirectTo, clearToken = false } = options;
  
  let userMessage = "An error occurred. Please try again.";

  // Handle different error types
  if (error?.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        userMessage = "Bad request. Please check your input and try again.";
        break;
      case 401:
        userMessage = "Authentication failed. Please log in again.";
        if (clearToken) {
          localStorage.removeItem("token");
        }
        if (redirectTo) {
          window.location.href = redirectTo;
        }
        break;
      case 403:
        userMessage = "You do not have permission to perform this action.";
        break;
      case 404:
        userMessage = "The requested resource was not found.";
        break;
      case 409:
        userMessage = "A resource with this information already exists.";
        break;
      case 422:
        if (data?.errors) {
          const validationErrors = Object.values(data.errors).join(", ");
          userMessage = `Validation errors: ${validationErrors}`;
        } else {
          userMessage = "Please check your input and try again.";
        }
        break;
      case 429:
        userMessage = "Too many requests. Please wait a moment and try again.";
        break;
      case 500:
        userMessage = "Server error. Please try again later.";
        break;
      case 502:
      case 503:
      case 504:
        userMessage = "Service temporarily unavailable. Please try again later.";
        break;
      default:
        userMessage = data?.message || "An error occurred. Please try again.";
    }
  } else if (error?.request) {
    // Network error
    userMessage = "Network error. Please check your connection and try again.";
  } else if (error?.code === "NETWORK_ERROR") {
    userMessage = "Network error. Please check your connection and try again.";
  } else if (error?.code === "TIMEOUT_ERROR") {
    userMessage = "Request timed out. Please try again.";
  } else if (error?.message) {
    userMessage = error.message;
  }

  return userMessage;
};

/**
 * Get appropriate error color for UI components
 */
export const getErrorColor = (error: any): "error" | "warning" | "info" => {
  if (error?.status === 401 || error?.status === 403) {
    return "error";
  } else if (error?.status === 422 || error?.status === 409) {
    return "warning";
  } else if (error?.status >= 500) {
    return "error";
  } else if (error?.code === "NETWORK_ERROR") {
    return "warning";
  }
  return "error";
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: any): boolean => {
  if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
    return false;
  }
  if (error?.code === "NETWORK_ERROR" || error?.status >= 500) {
    return true;
  }
  return false;
};

/**
 * Get retry delay based on error type
 */
export const getRetryDelay = (error: any, attempt: number): number => {
  if (error?.status === 429) {
    // Rate limiting - exponential backoff
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }
  if (error?.code === "NETWORK_ERROR") {
    // Network error - shorter delay
    return Math.min(1000 * attempt, 5000);
  }
  // Default delay
  return 1000 * attempt;
};

/**
 * Format error for logging
 */
export const formatErrorForLogging = (error: any, context?: string): string => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    status: error?.status || error?.response?.status,
    code: error?.code,
    message: error?.message || error?.response?.data?.message,
    url: error?.config?.url,
    method: error?.config?.method,
  };

  return JSON.stringify(errorInfo, null, 2);
};

