import { User } from "../types";

const BASE_URL = "http://localhost:5000/api/auth";

export async function login(data: {
  username: string;
  password: string;
}): Promise<User> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Invalid login");
  return res.json();
}

export async function getProfile(): Promise<User> {
  const res = await fetch(`${BASE_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function logout(): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}
