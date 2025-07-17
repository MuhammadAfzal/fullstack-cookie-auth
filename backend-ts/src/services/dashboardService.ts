import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardSummary() {
  // TODO: Replace with real DB queries
  return {
    totalUsers: 42,
    newUsersThisMonth: 5,
    // Add more summary stats as needed
  };
}

export async function getDashboardChartData() {
  // TODO: Replace with real DB queries
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    data: [5, 8, 12, 20, 15], // Example: new users per month
  };
}

export async function getDashboardActivity() {
  // TODO: Replace with real DB queries
  return [
    { type: "user_registered", username: "alice", date: "2024-06-01" },
    { type: "user_registered", username: "bob", date: "2024-06-02" },
    // Add more activity items as needed
  ];
}
