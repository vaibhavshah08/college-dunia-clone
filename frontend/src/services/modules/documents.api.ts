import apiClient from "../apiClient";
import type { Document, PaginatedResponse } from "../../types/api";

export const documentsApi = {
  /**
   * Upload document
   */
  async uploadDocument(
    file: File,
    name: string,
    purpose: string,
    type: string,
    documentType?: string,
    loanId?: string
  ): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("purpose", purpose);
    formData.append("type", type);
    if (documentType) {
      formData.append("document_type", documentType);
    }
    if (loanId) {
      formData.append("loan_id", loanId);
    }

    const response = await apiClient.post<Document>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get user documents
   */
  async getUserDocuments(): Promise<Document[]> {
    const response = await apiClient.get<Document[]>("/documents/my-documents");
    return response.data;
  },

  /**
   * Get all documents (Admin only)
   */
  async getAllDocuments(
    page: number = 1,
    limit: number = 10,
    status?: string,
    userId?: string,
    loanId?: string,
    startDate?: string,
    endDate?: string,
    search?: string
  ): Promise<{ documents: Document[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    if (userId) params.append("userId", userId);
    if (loanId) params.append("loanId", loanId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (search && search.trim()) params.append("search", search.trim());

    const response = await apiClient.get<{
      documents: Document[];
      pagination: any;
    }>(`/admin/documents?${params.toString()}`);
    return response.data;
  },

  /**
   * Get document by ID (Admin only)
   */
  async getDocument(id: string): Promise<Document> {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  /**
   * Update document status (Admin only)
   */
  async updateDocumentStatus(
    id: string,
    status: string,
    rejectionReason?: string
  ): Promise<Document> {
    const response = await apiClient.put<Document>(`/documents/${id}/status`, {
      status,
      rejection_reason: rejectionReason,
    });
    return response.data;
  },

  /**
   * Delete user document (only if pending)
   */
  async deleteMyDocument(id: string): Promise<void> {
    await apiClient.delete(`/documents/my-documents/${id}`);
  },

  /**
   * Delete document (Admin only)
   */
  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },

  /**
   * Download document
   */
  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export default documentsApi;
