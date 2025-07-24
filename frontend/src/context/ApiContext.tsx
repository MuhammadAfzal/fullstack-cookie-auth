import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { apiClient } from "../services/apiClient";

// API State interface
interface ApiState {
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// API Context State
interface ApiContextState {
  auth: ApiState;
  user: ApiState;
  profile: ApiState;
  dashboard: ApiState;
  health: ApiState;
}

// API Actions
type ApiAction =
  | { type: "SET_LOADING"; service: keyof ApiContextState; loading: boolean }
  | { type: "SET_ERROR"; service: keyof ApiContextState; error: string | null }
  | {
      type: "SET_LAST_UPDATED";
      service: keyof ApiContextState;
      timestamp: number;
    }
  | { type: "RESET_SERVICE"; service: keyof ApiContextState }
  | { type: "RESET_ALL" };

// Initial state
const initialState: ApiContextState = {
  auth: { loading: false, error: null, lastUpdated: null },
  user: { loading: false, error: null, lastUpdated: null },
  profile: { loading: false, error: null, lastUpdated: null },
  dashboard: { loading: false, error: null, lastUpdated: null },
  health: { loading: false, error: null, lastUpdated: null },
};

// Reducer
function apiReducer(
  state: ApiContextState,
  action: ApiAction
): ApiContextState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        [action.service]: {
          ...state[action.service],
          loading: action.loading,
          error: action.loading ? null : state[action.service].error,
        },
      };
    case "SET_ERROR":
      return {
        ...state,
        [action.service]: {
          ...state[action.service],
          error: action.error,
          loading: false,
        },
      };
    case "SET_LAST_UPDATED":
      return {
        ...state,
        [action.service]: {
          ...state[action.service],
          lastUpdated: action.timestamp,
        },
      };
    case "RESET_SERVICE":
      return {
        ...state,
        [action.service]: initialState[action.service],
      };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
}

// Context
interface ApiContextType {
  state: ApiContextState;
  dispatch: React.Dispatch<ApiAction>;
  executeApiCall: <T>(
    service: keyof ApiContextState,
    apiCall: () => Promise<T>
  ) => Promise<T>;
  resetService: (service: keyof ApiContextState) => void;
  resetAll: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  const executeApiCall = async <T,>(
    service: keyof ApiContextState,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    dispatch({ type: "SET_LOADING", service, loading: true });
    dispatch({ type: "SET_ERROR", service, error: null });

    try {
      const result = await apiCall();
      dispatch({ type: "SET_LOADING", service, loading: false });
      dispatch({ type: "SET_LAST_UPDATED", service, timestamp: Date.now() });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      dispatch({ type: "SET_ERROR", service, error: errorMessage });
      throw error;
    }
  };

  const resetService = (service: keyof ApiContextState) => {
    dispatch({ type: "RESET_SERVICE", service });
  };

  const resetAll = () => {
    dispatch({ type: "RESET_ALL" });
  };

  const value: ApiContextType = {
    state,
    dispatch,
    executeApiCall,
    resetService,
    resetAll,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

// Hook to use the API context
export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
}

// Specific hooks for each service
export function useAuthContext() {
  const { state, executeApiCall, resetService } = useApiContext();
  const authState = state.auth;

  const login = async (credentials: { username: string; password: string }) => {
    return executeApiCall("auth", () => apiClient.login(credentials));
  };

  const register = async (data: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    return executeApiCall("auth", () => apiClient.register(data));
  };

  const logout = async () => {
    return executeApiCall("auth", () => apiClient.logout());
  };

  const getProfile = async () => {
    return executeApiCall("auth", () => apiClient.getProfile());
  };

  const reset = () => resetService("auth");

  return {
    ...authState,
    login,
    register,
    logout,
    getProfile,
    reset,
  };
}

export function useUserContext() {
  const { state, executeApiCall, resetService } = useApiContext();
  const userState = state.user;

  const getCurrentUser = async () => {
    return executeApiCall("user", () => apiClient.getCurrentUser());
  };

  const updateUser = async (data: any) => {
    return executeApiCall("user", () => apiClient.updateUser(data));
  };

  const deleteUser = async () => {
    return executeApiCall("user", () => apiClient.deleteUser());
  };

  const searchUsers = async (query: string, page = 1, limit = 10) => {
    return executeApiCall("user", () =>
      apiClient.searchUsers(query, page, limit)
    );
  };

  const getUserById = async (id: string) => {
    return executeApiCall("user", () => apiClient.getUserById(id));
  };

  const getUserByUsername = async (username: string) => {
    return executeApiCall("user", () => apiClient.getUserByUsername(username));
  };

  const reset = () => resetService("user");

  return {
    ...userState,
    getCurrentUser,
    updateUser,
    deleteUser,
    searchUsers,
    getUserById,
    getUserByUsername,
    reset,
  };
}

export function useProfileContext() {
  const { state, executeApiCall, resetService } = useApiContext();
  const profileState = state.profile;

  const getProfileData = async () => {
    return executeApiCall("profile", () => apiClient.getProfileData());
  };

  const updateProfile = async (data: any) => {
    return executeApiCall("profile", () => apiClient.updateProfile(data));
  };

  const uploadAvatar = async (file: File) => {
    return executeApiCall("profile", () => apiClient.uploadAvatar(file));
  };

  const deleteAvatar = async () => {
    return executeApiCall("profile", () => apiClient.deleteAvatar());
  };

  const reset = () => resetService("profile");

  return {
    ...profileState,
    getProfileData,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    reset,
  };
}

export function useDashboardContext() {
  const { state, executeApiCall, resetService } = useApiContext();
  const dashboardState = state.dashboard;

  const getSummary = async () => {
    return executeApiCall("dashboard", () => apiClient.getDashboardSummary());
  };

  const getChartData = async () => {
    return executeApiCall("dashboard", () => apiClient.getDashboardChartData());
  };

  const getActivity = async () => {
    return executeApiCall("dashboard", () => apiClient.getDashboardActivity());
  };

  const getMetrics = async () => {
    return executeApiCall("dashboard", () => apiClient.getDashboardMetrics());
  };

  const reset = () => resetService("dashboard");

  return {
    ...dashboardState,
    getSummary,
    getChartData,
    getActivity,
    getMetrics,
    reset,
  };
}

export function useHealthContext() {
  const { state, executeApiCall, resetService } = useApiContext();
  const healthState = state.health;

  const checkHealth = async () => {
    return executeApiCall("health", () => apiClient.healthCheck());
  };

  const reset = () => resetService("health");

  return {
    ...healthState,
    checkHealth,
    reset,
  };
}
