import apiClient from "../apiClient";
import { LOAN_ENDPOINTS } from "../endpoints";
import type {
  LoanCreate,
  Loan,
  LoanStatusUpdate,
  PaginatedResponse,
  ApiResponse,
} from "../../types/api";

export const loansApi = {
  /**
   * Create new loan application
   */
  async createLoan(data: LoanCreate): Promise<Loan> {
    const response = await apiClient.post<ApiResponse<Loan>>(
      LOAN_ENDPOINTS.CREATE,
      data
    );
    return response.data.data;
  },

  /**
   * Get user's loan applications
   */
  async getMyLoans(): Promise<Loan[]> {
    const response = await apiClient.get<ApiResponse<Loan[]>>(
      LOAN_ENDPOINTS.LIST_MINE
    );
    return response.data.data;
  },

  /**
   * Get loan by ID
   */
  async getLoan(id: string): Promise<Loan> {
    const response = await apiClient.get<ApiResponse<Loan>>(
      LOAN_ENDPOINTS.DETAIL(id)
    );
    return response.data.data;
  },

  /**
   * Get all loans (Admin only)
   */
  async getAllLoans(): Promise<PaginatedResponse<Loan>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Loan>>>(
      LOAN_ENDPOINTS.ADMIN_LIST
    );
    return response.data.data;
  },

  /**
   * Update loan status (Admin only)
   */
  async updateLoanStatus(id: string, data: LoanStatusUpdate): Promise<Loan> {
    const response = await apiClient.patch<ApiResponse<Loan>>(
      LOAN_ENDPOINTS.UPDATE_STATUS(id),
      data
    );
    return response.data.data;
  },
};

export default loansApi;
