import apiClient from "../apiClient";

export interface Message {
  message_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const messagesApi = {
  // Create a new message (public endpoint)
  createMessage: async (messageData: CreateMessageDto): Promise<Message> => {
    const response = await apiClient.post("/messages", messageData);
    return response.data;
  },

  // Get all messages (admin only)
  getAllMessages: async (
    page: number = 1,
    limit: number = 10
  ): Promise<MessageListResponse> => {
    const response = await apiClient.get(
      `/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get message by ID (admin only)
  getMessageById: async (messageId: string): Promise<Message> => {
    const response = await apiClient.get(`/messages/${messageId}`);
    return response.data;
  },

  // Mark message as read (admin only)
  markAsRead: async (messageId: string): Promise<Message> => {
    const response = await apiClient.put(`/messages/${messageId}/read`);
    return response.data;
  },

  // Delete message (admin only)
  deleteMessage: async (messageId: string): Promise<void> => {
    const response = await apiClient.delete(`/messages/${messageId}`);
    return response.data;
  },

  // Get unread messages count (admin only)
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get("/messages/unread-count");
    return response.data;
  },
};

export default messagesApi;
