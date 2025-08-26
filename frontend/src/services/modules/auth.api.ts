import apiClient from "../apiClient";
import { AUTH_ENDPOINTS } from "../endpoints";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  UserProfile,
} from "../../types/api";

export const authApi = {
  /**
   * User login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    console.log("login response:", response);
    return response.data;
  },

  /**
   * User registration
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.SIGNUP,
      data
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(
      AUTH_ENDPOINTS.ME
    );
    return response.data;
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  /**
   * User logout
   */
  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },
};

export default authApi;
