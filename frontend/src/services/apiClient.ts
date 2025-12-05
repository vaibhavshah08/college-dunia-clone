import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { getAuthToken, removeToken } from "../utils/tokenManager";

// Global toast functions - will be set by the app
let globalToast: {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
} | null = null;

// Function to set global toast from the app
export const setGlobalToast = (toast: typeof globalToast) => {
  globalToast = toast;
};

// Fallback toast function
function showToast(
  message: string,
  type: "error" | "success" | "info" | "warning" = "error"
) {
  if (globalToast) {
    globalToast[type](message);
  } else {
    console.warn(`Toast (${type}): ${message}`);
  }
}

// Environment configuration
// const API_BASE_URL = "https://66mz5dpp-7001.inc1.devtunnels.ms";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

// Request cancellation
const pendingRequests = new Map<string, AbortController>();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies if needed
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token using token manager
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add correlation ID for tracking
    const correlationId = generateCorrelationId();
    if (config.headers) {
      config.headers["X-Correlation-ID"] = correlationId;
    }

    // Handle request cancellation
    const requestKey = `${config.method}-${config.url}`;
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort();
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clean up pending request
    const requestKey = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestKey);

    // Extract data from the new response format
    if (response.data && response.data.data !== undefined) {
      // Handle double-nested structure: { message, data: { data: {...} } }
      if (response.data.data && response.data.data.data !== undefined) {
        response.data = response.data.data.data;
      } else {
        // Handle single-nested structure: { message, data: {...} }
        response.data = response.data.data;
      }
    }

    // Show success toast for successful operations
    const method = response.config.method?.toUpperCase();
    const url = response.config.url || "";

    if (
      method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE"
    ) {
      let successMessage = "";

      if (method === "POST") {
        if (url.includes("/users/signup")) {
          successMessage = "User registered successfully!";
        } else if (url.includes("/users/login")) {
          successMessage = "Login successful!";
        } else if (url.includes("/colleges")) {
          successMessage = "College added successfully!";
        } else if (url.includes("/loans")) {
          successMessage = "Loan application submitted successfully!";
        } else if (url.includes("/documents")) {
          successMessage = "Document uploaded successfully!";
        } else {
          successMessage = "Created successfully!";
        }
      } else if (method === "PUT" || method === "PATCH") {
        if (url.includes("/users/") && url.includes("/profile")) {
          successMessage = "Profile updated successfully!";
        } else if (url.includes("/users/")) {
          successMessage = "User updated successfully!";
        } else if (url.includes("/colleges/")) {
          successMessage = "College updated successfully!";
        } else if (url.includes("/loans/")) {
          successMessage = "Loan updated successfully!";
        } else if (url.includes("/documents/")) {
          successMessage = "Document updated successfully!";
        } else {
          successMessage = "Updated successfully!";
        }
      } else if (method === "DELETE") {
        if (url.includes("/users/")) {
          successMessage = "User deleted successfully!";
        } else if (url.includes("/colleges/")) {
          successMessage = "College deleted successfully!";
        } else if (url.includes("/loans/")) {
          successMessage = "Loan deleted successfully!";
        } else if (url.includes("/documents/")) {
          successMessage = "Document deleted successfully!";
        } else {
          successMessage = "Deleted successfully!";
        }
      }

      if (successMessage) {
        showToast(successMessage, "success");
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Clean up pending request
    if (error.config) {
      const requestKey = `${error.config.method}-${error.config.url}`;
      pendingRequests.delete(requestKey);
    }

    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token but don't redirect automatically
          // Let the component handle the redirect
          removeToken();

          // Handle specific auth error messages
          const errorMessage = (data as any)?.message;
          if (errorMessage === "User is Inactive") {
            showToast("Your account is inactive. Please contact support.");
          } else if (errorMessage === "User doesnot exist") {
            showToast("User does not exist. Please check your credentials.");
          } else if (errorMessage === "Invalid credentials") {
            showToast("Invalid email or password. Please try again.");
          } else if (errorMessage === "Invalid Google token") {
            showToast("Google authentication failed. Please try again.");
          } else {
            showToast("Authentication failed. Please try again.");
          }
          break;

        case 403:
          // Forbidden
          showToast("You do not have permission to perform this action");
          break;

        case 409:
          // Conflict - handle specific signup error
          const conflictMessage = (data as any)?.message;
          if (conflictMessage === "User email already exists") {
            showToast(
              "An account with this email already exists. Please use a different email or try logging in."
            );
          } else {
            showToast("A conflict occurred. Please try again.");
          }
          break;

        case 404:
          // Not found - only show toast for specific endpoints to avoid duplicates
          const url = error.config?.url || "";
          if (url.includes("/loans/") && !url.includes("/colleges/")) {
            showToast(
              "Loan not found. Please check the loan ID and try again."
            );
          } else if (url.includes("/colleges/")) {
            // Don't show toast for college 404s as they're handled in the UI
            return Promise.reject(normalizeError(error));
          } else {
            showToast("The requested resource was not found");
          }
          break;

        case 422:
          // Validation error
          const validationErrors = (data as any)?.errors;
          if (validationErrors) {
            Object.values(validationErrors).forEach((message: any) => {
              showToast(message as string);
            });
          } else {
            showToast("Validation failed");
          }
          break;

        case 500:
          // Server error
          showToast(
            "An internal server error occurred. Please try again later."
          );
          break;

        default:
          // Other errors
          const defaultErrorMessage =
            (data as any)?.message || "An error occurred";
          showToast(defaultErrorMessage);
      }
    } else if (error.request) {
      // Network error
      showToast("Network error. Please check your connection and try again.");
    } else {
      // Other error
      showToast("An unexpected error occurred");
    }

    return Promise.reject(normalizeError(error));
  }
);

// Error normalization
function normalizeError(error: AxiosError) {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      code: (data as any)?.code || "UNKNOWN_ERROR",
      message: (data as any)?.message || "An error occurred",
      details: (data as any)?.details || null,
    };
  }

  return {
    status: 0,
    code: "NETWORK_ERROR",
    message: "Network error",
    details: null,
  };
}

// Generate correlation ID
function generateCorrelationId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Cancel all pending requests
export const cancelAllRequests = () => {
  pendingRequests.forEach((controller) => controller.abort());
  pendingRequests.clear();
};

// Cancel specific request
export const cancelRequest = (method: string, url: string) => {
  const requestKey = `${method}-${url}`;
  const controller = pendingRequests.get(requestKey);
  if (controller) {
    controller.abort();
    pendingRequests.delete(requestKey);
  }
};

export default apiClient;
