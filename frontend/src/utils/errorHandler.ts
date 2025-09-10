import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

export const getErrorMessage = (error: any): string => {
  // If it's an Axios error with response
  if (error?.response) {
    const axiosError = error as AxiosError;
    const response = axiosError.response as any;

    // Try to get error message from response data
    if (response.data) {
      const data = response.data as any;

      // Check for different error message formats
      if (typeof data === "string") {
        return `${data} (${response.status})`;
      }

      if (data.message) {
        return `${data.message} (${response.status})`;
      }

      if (data.error) {
        return `${data.error} (${response.status})`;
      }

      if (data.details) {
        return `${data.details} (${response.status})`;
      }

      // If response data is an array (validation errors)
      if (Array.isArray(data)) {
        return `${data.join(", ")} (${response.status})`;
      }
    }

    // Fallback to status text
    return `${response.statusText || "Request failed"} (${response.status})`;
  }

  // If it's a network error
  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // If it's a timeout error
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return "Request timeout. Please try again.";
  }

  // If error has a message
  if (error?.message) {
    return error.message;
  }

  // Generic fallback
  return "An unexpected error occurred. Please try again.";
};

export const getErrorStatus = (error: any): number => {
  if (error?.response?.status) {
    return error.response.status;
  }
  return 500;
};
