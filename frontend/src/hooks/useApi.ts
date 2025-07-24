import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../services/apiClient";

// API State interface
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API Response wrapper
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Custom hook for API calls
export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common operations
export function useAuth() {
  const { data: user, loading, error, execute, reset } = useApi();

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      return execute(() => apiClient.login(credentials));
    },
    [execute]
  );

  const register = useCallback(
    async (data: {
      username: string;
      password: string;
      confirmPassword: string;
    }) => {
      return execute(() => apiClient.register(data));
    },
    [execute]
  );

  const logout = useCallback(async () => {
    return execute(() => apiClient.logout());
  }, [execute]);

  const getProfile = useCallback(async () => {
    return execute(() => apiClient.getProfile());
  }, [execute]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getProfile,
    reset,
  };
}

export function useUser() {
  const { data: user, loading, error, execute, reset } = useApi();

  const getCurrentUser = useCallback(async () => {
    return execute(() => apiClient.getCurrentUser());
  }, [execute]);

  const updateUser = useCallback(
    async (data: any) => {
      return execute(() => apiClient.updateUser(data));
    },
    [execute]
  );

  const deleteUser = useCallback(async () => {
    return execute(() => apiClient.deleteUser());
  }, [execute]);

  const searchUsers = useCallback(
    async (query: string, page = 1, limit = 10) => {
      return execute(() => apiClient.searchUsers(query, page, limit));
    },
    [execute]
  );

  const getUserById = useCallback(
    async (id: string) => {
      return execute(() => apiClient.getUserById(id));
    },
    [execute]
  );

  const getUserByUsername = useCallback(
    async (username: string) => {
      return execute(() => apiClient.getUserByUsername(username));
    },
    [execute]
  );

  return {
    user,
    loading,
    error,
    getCurrentUser,
    updateUser,
    deleteUser,
    searchUsers,
    getUserById,
    getUserByUsername,
    reset,
  };
}

export function useProfile() {
  const { data: profile, loading, error, execute, reset } = useApi();

  const getProfileData = useCallback(async () => {
    return execute(() => apiClient.getProfileData());
  }, [execute]);

  const updateProfile = useCallback(
    async (data: any) => {
      return execute(() => apiClient.updateProfile(data));
    },
    [execute]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      return execute(() => apiClient.uploadAvatar(file));
    },
    [execute]
  );

  const deleteAvatar = useCallback(async () => {
    return execute(() => apiClient.deleteAvatar());
  }, [execute]);

  return {
    profile,
    loading,
    error,
    getProfileData,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    reset,
  };
}

export function useDashboard() {
  const { data: dashboardData, loading, error, execute, reset } = useApi();

  const getSummary = useCallback(async () => {
    return execute(() => apiClient.getDashboardSummary());
  }, [execute]);

  const getChartData = useCallback(async () => {
    return execute(() => apiClient.getDashboardChartData());
  }, [execute]);

  const getActivity = useCallback(async () => {
    return execute(() => apiClient.getDashboardActivity());
  }, [execute]);

  const getMetrics = useCallback(async () => {
    return execute(() => apiClient.getDashboardMetrics());
  }, [execute]);

  return {
    dashboardData,
    loading,
    error,
    getSummary,
    getChartData,
    getActivity,
    getMetrics,
    reset,
  };
}

// Hook for health checks
export function useHealthCheck() {
  const { data: health, loading, error, execute, reset } = useApi();

  const checkHealth = useCallback(async () => {
    return execute(() => apiClient.healthCheck());
  }, [execute]);

  return {
    health,
    loading,
    error,
    checkHealth,
    reset,
  };
}

// Hook for managing multiple API states
export function useApiState() {
  const [states, setStates] = useState<Record<string, ApiState<any>>>({});

  const setApiState = useCallback(
    (key: string, state: Partial<ApiState<any>>) => {
      setStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...state },
      }));
    },
    []
  );

  const resetApiState = useCallback((key: string) => {
    setStates((prev) => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const resetAllStates = useCallback(() => {
    setStates({});
  }, []);

  return {
    states,
    setApiState,
    resetApiState,
    resetAllStates,
  };
}
