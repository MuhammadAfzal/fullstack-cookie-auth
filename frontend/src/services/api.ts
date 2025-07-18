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
    "http://localhost:5000/api"
  : (import.meta as ImportMetaWithEnv).env.VITE_API_URL_PROD ||
    "http://localhost:5000/api";

export async function login(data: {
  username: string;
  password: string;
}): Promise<User> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Login failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

export async function register(data: {
  username: string;
  password: string;
  confirmPassword: string;
}): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
}

export async function getProfile(): Promise<{ user: User }> {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function logout(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}

export async function getDashboardSummary() {
  const res = await fetch(`${API_URL}/dashboard/summary`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}

export async function getDashboardChartData() {
  const res = await fetch(`${API_URL}/dashboard/chart-data`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard chart data");
  return res.json();
}

export async function getDashboardActivity() {
  const res = await fetch(`${API_URL}/dashboard/activity`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard activity");
  return res.json();
}

export async function getDashboardMetrics() {
  const res = await fetch(`${API_URL}/dashboard/metrics`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
  return res.json();
}

export async function getProfileData(): Promise<any> {
  const res = await fetch(`${API_URL}/profile`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateProfile(data: any): Promise<any> {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update profile");
  }
  return res.json();
}

export async function uploadAvatar(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to upload avatar");
  }
  return res.json();
}

export async function deleteAvatar(): Promise<any> {
  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete avatar");
  return res.json();
}
