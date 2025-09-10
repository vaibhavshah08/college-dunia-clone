// Token management utilities for secure token handling

const TOKEN_KEY = "token";
const TOKEN_EXPIRY_KEY = "token_expiry";

export interface TokenData {
  token: string;
  expiresAt?: number;
}

/**
 * Save token to localStorage with optional expiry
 */
export const saveToken = (token: string, expiresIn?: number): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    
    if (expiresIn) {
      const expiresAt = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
    }
  } catch (error) {
    console.error("Failed to save token:", error);
  }
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return false; // No expiry set, assume valid
    
    const expiresAt = parseInt(expiry, 10);
    return Date.now() >= expiresAt;
  } catch (error) {
    console.error("Failed to check token expiry:", error);
    return true; // Assume expired if error
  }
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired
  if (isTokenExpired()) {
    removeToken(); // Clean up expired token
    return false;
  }
  
  return true;
};

/**
 * Get token for API calls
 */
export const getAuthToken = (): string | null => {
  if (!isAuthenticated()) {
    return null;
  }
  return getToken();
};

/**
 * Parse JWT token payload (for debugging/development)
 */
export const parseToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse token:", error);
    return null;
  }
};

/**
 * Get token expiry time (for debugging/development)
 */
export const getTokenExpiry = (): Date | null => {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return null;
    
    return new Date(parseInt(expiry, 10));
  } catch (error) {
    console.error("Failed to get token expiry:", error);
    return null;
  }
};

/**
 * Refresh token (placeholder for future implementation)
 */
export const refreshToken = async (): Promise<boolean> => {
  // This would typically make an API call to refresh the token
  // For now, return false to indicate no refresh mechanism
  return false;
};

