export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: number;
  username: string;
  role: Role;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
  email?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceConfig {
  port: number;
  name: string;
  version: string;
  environment: string;
  redisUrl?: string;
  databaseUrl?: string;
}

export interface HealthCheck {
  service: string;
  status: "healthy" | "unhealthy";
  timestamp: Date;
  uptime: number;
  version: string;
  checks: {
    database?: boolean;
    redis?: boolean;
    [key: string]: boolean | undefined;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: import("./types").AuthUser;
    }
  }
}
export {};
