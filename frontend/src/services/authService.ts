import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    phone_number?: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post("/users/login", data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post("/users/signup", data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};
