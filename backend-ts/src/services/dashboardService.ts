import { PrismaClient } from "@prisma/client";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

const prisma = new PrismaClient();

export async function getDashboardSummary() {
  const totalUsers = await prisma.user.count();

  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);
  const newUsersThisMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfThisMonth,
        lte: endOfThisMonth,
      },
    },
  });

  return {
    totalUsers,
    newUsersThisMonth,
  };
}

export async function getDashboardChartData() {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(now, 5 - i);
    return {
      label: format(date, "MMM"),
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  });

  const data = await Promise.all(
    months.map(async (m) =>
      prisma.user.count({
        where: {
          createdAt: {
            gte: m.start,
            lte: m.end,
          },
        },
      })
    )
  );

  return {
    labels: months.map((m) => m.label),
    data,
  };
}

export async function getDashboardActivity() {
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return recentUsers.map((user) => ({
    type: "user_registered",
    username: user.username,
    date: user.createdAt.toISOString().slice(0, 10),
  }));
}
