import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { toast } from "react-toastify";
import { getAuthToken, removeToken } from "../utils/tokenManager";

// Environment configuration
// const API_BASE_URL = "https://66mz5dpp-7001.inc1.devtunnels.ms";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:7001";

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
          break;

        case 403:
          // Forbidden
          toast.error("You do not have permission to perform this action");
          break;

        case 404:
          // Not found
          toast.error("The requested resource was not found");
          break;

        case 422:
          // Validation error
          const validationErrors = (data as any)?.errors;
          if (validationErrors) {
            Object.values(validationErrors).forEach((message: any) => {
              toast.error(message);
            });
          } else {
            toast.error("Validation failed");
          }
          break;

        case 500:
          // Server error
          toast.error(
            "An internal server error occurred. Please try again later."
          );
          break;

        default:
          // Other errors
          const errorMessage = (data as any)?.message || "An error occurred";
          toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection and try again.");
    } else {
      // Other error
      toast.error("An unexpected error occurred");
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
