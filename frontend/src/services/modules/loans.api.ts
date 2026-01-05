import apiClient from "../apiClient";
import { LOAN_ENDPOINTS } from "../endpoints";
import type {
  LoanCreate,
  Loan,
  LoanStatusUpdate,
  PaginatedResponse,
} from "../../types/api";

export const loansApi = {
  /**
   * Create new loan application
   */
  async createLoan(data: LoanCreate): Promise<Loan> {
    const response = await apiClient.post<Loan>(LOAN_ENDPOINTS.CREATE, data);
    return response.data;
  },

  /**
   * Get user's loan applications with pagination
   */
  async getMyLoans(
    page: number = 1,
    limit: number = 10
  ): Promise<{ loans: Loan[]; pagination: any } | Loan[]> {
    const response = await apiClient.get<{ loans: Loan[]; pagination: any } | Loan[]>(
      `${LOAN_ENDPOINTS.LIST_MINE}?page=${page}&limit=${limit}`
    );
    // Handle both paginated and non-paginated responses for backward compatibility
    if (response.data && typeof response.data === 'object' && 'loans' in response.data) {
      return response.data;
    }
    return response.data as Loan[];
  },

  /**
   * Get loan by ID
   */
  async getLoan(id: string): Promise<Loan> {
    const response = await apiClient.get<Loan>(LOAN_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  /**
   * Get all loans (Admin only)
   */
  async getAllLoans(
    page: number = 1,
    limit: number = 10,
    status?: string,
    userId?: string,
    collegeId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ loans: Loan[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    if (userId) params.append("userId", userId);
    if (collegeId) params.append("collegeId", collegeId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get<{ loans: Loan[]; pagination: any }>(
      `/admin/loans?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get loans by college ID (Admin only)
   */
  async getLoansByCollegeId(collegeId: string): Promise<Loan[]> {
    const response = await apiClient.get<Loan[]>(
      `/api/loans/college/${collegeId}`
    );
    return response.data;
  },

  /**
   * Update loan (User only)
   */
  async updateLoan(id: string, data: LoanCreate): Promise<Loan> {
    const response = await apiClient.patch<Loan>(
      LOAN_ENDPOINTS.DETAIL(id),
      data
    );
    return response.data;
  },

  /**
   * Update loan status (Admin only)
   */
  async updateLoanStatus(id: string, status: string): Promise<Loan> {
    const response = await apiClient.patch<Loan>(
      LOAN_ENDPOINTS.UPDATE_STATUS(id, status)
    );
    return response.data;
  },
};

export default loansApi;
