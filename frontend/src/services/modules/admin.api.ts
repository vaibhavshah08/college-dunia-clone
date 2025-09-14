import apiClient from "../apiClient";
import type { User, PaginatedResponse } from "../../types/api";

export interface AdminDashboardStats {
  totalUsers: number;
  totalColleges: number;
  totalLoans: number;
  totalDocuments: number;
  pendingLoans: number;
  partneredColleges: number;
}

export interface AdminUsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminApi = {
  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<AdminDashboardStats>(
      "/admin/dashboard"
    );
    return response.data;
  },

  /**
   * Get all users with pagination and search
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<AdminUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    const response = await apiClient.get<AdminUsersResponse>(
      `/admin/users?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Create user (Admin only)
   */
  async createUser(userData: any): Promise<any> {
    const response = await apiClient.post<any>("/admin/users", userData);
    return response.data;
  },

  /**
   * Update user (Admin only)
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${id}`, userData);
    return response.data;
  },

  /**
   * Check user dependencies (Admin only)
   */
  async checkUserDependencies(id: string): Promise<{
    loans: number;
    documents: number;
    hasDependencies: boolean;
  }> {
    const response = await apiClient.get<{
      loans: number;
      documents: number;
      hasDependencies: boolean;
    }>(`/admin/users/${id}/dependencies`);
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  async deleteUser(
    id: string,
    mode: "USER_ONLY" | "WITH_DEPENDENCIES" = "USER_ONLY"
  ): Promise<{
    user_id: string;
    mode: string;
    deletedCounts?: {
      loans: number;
      documents: number;
    };
  }> {
    const response = await apiClient.delete<{
      user_id: string;
      mode: string;
      deletedCounts?: {
        loans: number;
        documents: number;
      };
    }>(`/admin/users/${id}?mode=${mode}`);
    return response.data;
  },
};

export default adminApi;
