import apiClient from "../apiClient";
import { UserProfile } from "../../types/api";

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

export const userApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>("/users/me");
    return response.data;
  },

  /**
   * Update current user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateUserRequest
  ): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(`/users/${userId}`);
    return response.data;
  },
};

export default userApi;
