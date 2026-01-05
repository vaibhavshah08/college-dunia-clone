import apiClient from "../apiClient";
import { COLLEGE_ENDPOINTS } from "../endpoints";
import type {
  CollegeListQuery,
  College,
  CollegeDetail,
  CollegeFilters,
  CompareRequest,
  CompareResponse,
  CollegePlacement,
  CollegeListResponse,
} from "../../types/api";

export const collegesApi = {
  /**
   * Get colleges list with filters and pagination
   * Returns paginated response if page/limit are provided, otherwise returns array for backward compatibility
   */
  async getColleges(
    params: CollegeListQuery
  ): Promise<College[] | CollegeListResponse> {
    const response = await apiClient.get<College[] | CollegeListResponse>(
      COLLEGE_ENDPOINTS.LIST,
      {
        params,
      }
    );
    // After the interceptor, response.data is already extracted
    // If response has pagination structure, return it; otherwise return array for backward compatibility
    if (
      response.data &&
      typeof response.data === "object" &&
      "colleges" in response.data
    ) {
      return response.data as CollegeListResponse;
    }
    return response.data as College[];
  },

  /**
   * Get college by ID
   */
  async getCollege(id: string): Promise<CollegeDetail> {
    const response = await apiClient.get<CollegeDetail>(
      COLLEGE_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Compare colleges
   */
  async compareColleges(data: CompareRequest): Promise<CompareResponse> {
    const response = await apiClient.get<CompareResponse>(
      COLLEGE_ENDPOINTS.COMPARE,
      { params: { ids: data.ids.join(",") } }
    );
    return response.data;
  },

  /**
   * Get college filters
   */
  async getFilters(): Promise<CollegeFilters> {
    const response = await apiClient.get<CollegeFilters>(
      COLLEGE_ENDPOINTS.FILTERS
    );
    return response.data;
  },

  /**
   * Create new college (Admin only)
   */
  async createCollege(data: Partial<College>): Promise<College> {
    const response = await apiClient.post<College>(
      COLLEGE_ENDPOINTS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Create multiple colleges at once (Admin only)
   */
  async bulkCreateColleges(colleges: Partial<College>[]): Promise<{
    message: string;
    data: {
      created: any[];
      errors: any[];
      total_processed: number;
      successful: number;
      failed: number;
    };
  }> {
    const response = await apiClient.post(COLLEGE_ENDPOINTS.BULK_CREATE, {
      colleges,
    });
    return response.data;
  },

  /**
   * Update college (Admin only)
   */
  async updateCollege(id: string, data: Partial<College>): Promise<College> {
    const response = await apiClient.put<College>(
      COLLEGE_ENDPOINTS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Delete college (Admin only)
   */
  async deleteCollege(id: string): Promise<void> {
    await apiClient.delete(COLLEGE_ENDPOINTS.DELETE(id));
  },

  /**
   * Add placement data for college (Admin only)
   */
  async addPlacement(
    collegeId: string,
    data: Partial<CollegePlacement>
  ): Promise<CollegePlacement> {
    const response = await apiClient.post<CollegePlacement>(
      `${COLLEGE_ENDPOINTS.DETAIL(collegeId)}/placements`,
      data
    );
    return response.data;
  },

  /**
   * Get placement data for college
   */
  async getPlacements(collegeId: string): Promise<CollegePlacement[]> {
    const response = await apiClient.get<CollegePlacement[]>(
      `${COLLEGE_ENDPOINTS.DETAIL(collegeId)}/placements`
    );
    return response.data;
  },
};

export default collegesApi;
