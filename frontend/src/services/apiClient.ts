import { User } from "../types";

interface ImportMetaWithEnv extends ImportMeta {
  env: {
    VITE_API_URL: string;
    VITE_API_URL_DEV?: string;
    VITE_API_URL_PROD?: string;
    MODE: string;
  };
}

const isDev = (import.meta as ImportMetaWithEnv).env.MODE === "development";
const API_URL = isDev
  ? (import.meta as ImportMetaWithEnv).env.VITE_API_URL_DEV ||
    "http://localhost:3000/api"
  : (import.meta as ImportMetaWithEnv).env.VITE_API_URL_PROD ||
    "http://localhost:3000/api";

// API Response wrapper
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log("coming in request");
    const url = `${this.baseURL}${endpoint}`;
    console.log("end url", url);

    const defaultOptions: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);

      // Handle different response types
      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle API Gateway errors
        if (response.status === 503) {
          throw new Error(
            "Service temporarily unavailable. Please try again later."
          );
        }

        if (response.status === 401) {
          throw new Error("Authentication required. Please log in.");
        }

        if (response.status === 403) {
          throw new Error(
            "Access denied. You don't have permission to perform this action."
          );
        }

        if (response.status === 404) {
          throw new Error("Resource not found.");
        }

        if (response.status === 429) {
          throw new Error("Too many requests. Please slow down.");
        }

        // Handle custom error messages from API
        if (data && typeof data === "object") {
          throw new Error(
            data.message ||
              data.error ||
              `Request failed with status ${response.status}`
          );
        }

        throw new Error(
          data || `Request failed with status ${response.status}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please check your connection.");
    }
  }

  // Auth endpoints
  async login(credentials: {
    username: string;
    password: string;
  }): Promise<ApiResponse> {
    console.log("API_URL", API_URL);
    return await this.request<ApiResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: {
    username: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/me");
  }

  async logout(): Promise<ApiResponse> {
    return this.request<ApiResponse>("/auth/logout", {
      method: "POST",
    });
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>("/users");
  }

  async updateUser(data: Partial<User>): Promise<User> {
    return this.request<User>("/users", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(): Promise<ApiResponse> {
    return this.request<ApiResponse>("/users", {
      method: "DELETE",
    });
  }

  async searchUsers(
    query: string,
    page = 1,
    limit = 10
  ): Promise<{
    data: User[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    return this.request(
      `/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.request<User>(`/users/username/${username}`);
  }

  // Profile endpoints
  async getProfileData(): Promise<any> {
    return this.request("/users/profile");
  }

  async updateProfile(data: any): Promise<any> {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.request("/users/profile/avatar", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async deleteAvatar(): Promise<ApiResponse> {
    return this.request<ApiResponse>("/users/profile/avatar", {
      method: "DELETE",
    });
  }

  // Dashboard endpoints
  async getDashboardSummary(): Promise<any> {
    return this.request("/dashboard/summary");
  }

  // AI endpoints
  async generateInsights(
    payload: any
  ): Promise<{ success: boolean; insights: string[] }> {
    return this.request("/ai/insights", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getDashboardChartData(): Promise<any> {
    return this.request("/dashboard/chart-data");
  }

  async getDashboardActivity(): Promise<any> {
    return this.request("/dashboard/activity");
  }

  async getDashboardMetrics(): Promise<any> {
    return this.request("/dashboard/metrics");
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request("/health");
  }

  // Admin endpoints
  async getAllUsers(
    skip = 0,
    take = 50
  ): Promise<{ users: any[]; total: number }> {
    return this.request(`/admin/users?skip=${skip}&take=${take}`);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_URL);

// Export individual functions for backward compatibility
export const {
  login,
  register,
  getProfile,
  logout,
  getCurrentUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUserById,
  getUserByUsername,
  getProfileData,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getDashboardSummary,
  getDashboardChartData,
  getDashboardActivity,
  getDashboardMetrics,
  generateInsights,
  healthCheck,
  getAllUsers,
} = apiClient;
