import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { logger } from "../utils/logger";
import { CustomError } from "../middlewares/errorHandler";

interface ServiceConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

class ProxyService {
  private authService: AxiosInstance;
  private userService: AxiosInstance;
  private dashboardService: AxiosInstance;
  private config: ServiceConfig;

  constructor() {
    this.config = {
      baseURL: "",
      timeout: parseInt(process.env["PROXY_TIMEOUT"] || "30000"),
      retries: parseInt(process.env["PROXY_RETRIES"] || "3"),
    };

    // Initialize service clients
    this.authService = axios.create({
      baseURL:
        (process.env["AUTH_SERVICE_URL"] || "http://localhost:3001") +
        "/api/auth",
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.userService = axios.create({
      baseURL: process.env["USER_SERVICE_URL"] || "http://localhost:3002",
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.dashboardService = axios.create({
      baseURL: process.env["DASHBOARD_SERVICE_URL"] || "http://localhost:3003",
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptors for logging
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Auth Service interceptors
    this.authService.interceptors.request.use(
      (config) => {
        logger.info(
          `Auth Service Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        logger.error("Auth Service Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.authService.interceptors.response.use(
      (response) => {
        logger.info(
          `Auth Service Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        logger.error(
          "Auth Service Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );

    // User Service interceptors
    this.userService.interceptors.request.use(
      (config) => {
        logger.info(
          `User Service Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        logger.error("User Service Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.userService.interceptors.response.use(
      (response) => {
        logger.info(
          `User Service Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        logger.error(
          "User Service Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  async forwardToAuthService(
    method: string,
    path: string,
    data?: any,
    headers?: any
  ): Promise<AxiosResponse> {
    try {
      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: path,
        data,
        headers: {
          ...headers,
          "X-Forwarded-By": "API-Gateway",
        },
      };

      const response = await this.authService.request(config);
      return response;
    } catch (error: any) {
      logger.error("Auth Service forwarding error:", error);
      throw this.handleServiceError(error, "Auth Service");
    }
  }

  async forwardToUserService(
    method: string,
    path: string,
    data?: any,
    headers?: any
  ): Promise<AxiosResponse> {
    try {
      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: path,
        data,
        headers: {
          ...headers,
          "X-Forwarded-By": "API-Gateway",
        },
      };

      const response = await this.userService.request(config);
      console.log("response in dashboard proxy servicue");
      console.log(response);
      return response;
    } catch (error: any) {
      logger.error("User Service forwarding error:", error);
      throw this.handleServiceError(error, "User Service");
    }
  }

  async forwardToDashboardService(
    method: string,
    path: string,
    data?: any,
    headers?: any
  ): Promise<AxiosResponse> {
    try {
      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: path,
        data,
        headers: {
          ...headers,
          "X-Forwarded-By": "API-Gateway",
        },
      };
      const response = await this.dashboardService.request(config);
      return response;
    } catch (error: any) {
      logger.error("Dashboard Service forwarding error:", error);
      throw this.handleServiceError(error, "Dashboard Service");
    }
  }

  private handleServiceError(error: any, serviceName: string): CustomError {
    if (error.response) {
      // Service responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || `${serviceName} error`;

      logger.error(`${serviceName} error: ${status} - ${message}`);

      return new CustomError(message, status);
    } else if (error.request) {
      // Service is unreachable
      logger.error(`${serviceName} is unreachable:`, error.message);
      return new CustomError(`${serviceName} is currently unavailable`, 503);
    } else {
      // Other error
      logger.error(`${serviceName} error:`, error.message);
      return new CustomError("Internal gateway error", 500);
    }
  }

  async healthCheck(): Promise<{ auth: boolean; user: boolean }> {
    const health = { auth: false, user: false };

    try {
      // Create a temporary client for health check without the /api/auth prefix
      const authHealthClient = axios.create({
        baseURL: process.env["AUTH_SERVICE_URL"] || "http://localhost:3001",
        timeout: this.config.timeout,
      });
      await authHealthClient.get("/health");
      health.auth = true;
    } catch (error) {
      logger.error("Auth Service health check failed:", error);
    }

    try {
      await this.userService.get("/health");
      health.user = true;
    } catch (error) {
      logger.error("User Service health check failed:", error);
    }

    return health;
  }
}

export const proxyService = new ProxyService();
