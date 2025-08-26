import apiClient from "../apiClient";
import { COLLEGE_ENDPOINTS } from "../endpoints";
import type {
  CollegeListQuery,
  College,
  CollegeDetail,
  CollegeFilters,
  CompareRequest,
  CompareResponse,
  PaginatedResponse,
  ApiResponse,
} from "../../types/api";

export const collegesApi = {
  /**
   * Get colleges list with filters and pagination
   */
  async getColleges(
    params: CollegeListQuery
  ): Promise<PaginatedResponse<College>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<College>>
    >(COLLEGE_ENDPOINTS.LIST, { params });
    return response.data.data;
  },

  /**
   * Get college by ID
   */
  async getCollege(id: string): Promise<CollegeDetail> {
    const response = await apiClient.get<ApiResponse<CollegeDetail>>(
      COLLEGE_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  /**
   * Compare colleges
   */
  async compareColleges(data: CompareRequest): Promise<CompareResponse> {
    const response = await apiClient.get<ApiResponse<CompareResponse>>(
      COLLEGE_ENDPOINTS.COMPARE,
      { params: { ids: data.ids.join(",") } }
    );
    return response.data.data;
  },

  /**
   * Get college filters
   */
  async getFilters(): Promise<CollegeFilters> {
    const response = await apiClient.get<ApiResponse<CollegeFilters>>(
      COLLEGE_ENDPOINTS.FILTERS
    );
    return response.data.data;
  },

  /**
   * Create new college (Admin only)
   */
  async createCollege(data: Partial<College>): Promise<College> {
    const response = await apiClient.post<ApiResponse<College>>(
      COLLEGE_ENDPOINTS.CREATE,
      data
    );
    return response.data.data;
  },

  /**
   * Update college (Admin only)
   */
  async updateCollege(id: string, data: Partial<College>): Promise<College> {
    const response = await apiClient.put<ApiResponse<College>>(
      COLLEGE_ENDPOINTS.UPDATE(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete college (Admin only)
   */
  async deleteCollege(id: string): Promise<void> {
    await apiClient.delete(COLLEGE_ENDPOINTS.DELETE(id));
  },
};

export default collegesApi;
