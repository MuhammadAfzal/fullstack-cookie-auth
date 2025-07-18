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
  ? (import.meta as ImportMetaWithEnv).env.VITE_API_URL_DEV
  : (import.meta as ImportMetaWithEnv).env.VITE_API_URL_PROD;

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
