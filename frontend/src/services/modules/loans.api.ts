import apiClient from "../apiClient";
import { LOAN_ENDPOINTS } from "../endpoints";
import type {
  LoanCreate,
  Loan,
  LoanStatusUpdate,
  PaginatedResponse
} from "../../types/api";

export const loansApi = {
  /**
   * Create new loan application
   */
  async createLoan(data: LoanCreate): Promise<Loan> {
    const response = await apiClient.post<Loan>(
      LOAN_ENDPOINTS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Get user's loan applications
   */
  async getMyLoans(): Promise<Loan[]> {
    const response = await apiClient.get<Loan[]>(
      LOAN_ENDPOINTS.LIST_MINE
    );
    return response.data;
  },

  /**
   * Get loan by ID
   */
  async getLoan(id: string): Promise<Loan> {
    const response = await apiClient.get<Loan>(
      LOAN_ENDPOINTS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Get all loans (Admin only)
   */
  async getAllLoans(): Promise<PaginatedResponse<Loan>> {
    const response = await apiClient.get<PaginatedResponse<Loan>>(
      LOAN_ENDPOINTS.ADMIN_LIST
    );
    return response.data;
  },

  /**
   * Update loan status (Admin only)
   */
  async updateLoanStatus(id: string, data: LoanStatusUpdate): Promise<Loan> {
    const response = await apiClient.patch<Loan>(
      LOAN_ENDPOINTS.UPDATE_STATUS(id),
      data
    );
    return response.data;
  },
};

export default loansApi;
