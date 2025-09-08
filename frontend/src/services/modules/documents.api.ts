import apiClient from "../apiClient";
import type { Document, PaginatedResponse } from "../../types/api";

export const documentsApi = {
  /**
   * Upload document
   */
  async uploadDocument(file: File, documentType?: string): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    if (documentType) {
      formData.append("document_type", documentType);
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
    status?: string
  ): Promise<{ documents: Document[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append("status", status);
    }

    const response = await apiClient.get<{
      documents: Document[];
      pagination: any;
    }>(`/documents?${params.toString()}`);
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
