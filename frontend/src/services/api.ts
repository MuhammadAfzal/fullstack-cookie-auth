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
    const res = await fetch(`${API_URL}/login`, {
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
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function getProfile(): Promise<User> {
  const res = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function logout(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}
