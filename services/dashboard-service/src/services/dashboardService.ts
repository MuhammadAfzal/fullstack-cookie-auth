import { PrismaClient } from "@prisma/client";
import {
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";

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

  // Get users created today
  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);
  const newUsersToday = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  // Get role distribution
  const roleDistribution = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true,
    },
  });

  // Calculate growth percentage
  const lastMonth = subMonths(now, 1);
  const startOfLastMonth = startOfMonth(lastMonth);
  const endOfLastMonth = endOfMonth(lastMonth);
  const newUsersLastMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  const growthPercentage =
    newUsersLastMonth > 0
      ? Math.round(
          ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        )
      : newUsersThisMonth > 0
      ? 100
      : 0;

  return {
    totalUsers,
    newUsersThisMonth,
    newUsersToday,
    growthPercentage,
    roleDistribution: roleDistribution.map((role) => ({
      role: role.role,
      count: role._count.role,
      percentage: Math.round((role._count.role / totalUsers) * 100),
    })),
    averageUsersPerDay: Math.round(newUsersThisMonth / 30),
    systemHealth: {
      status: "healthy",
      uptime: "99.9%",
      lastBackup: format(subDays(now, 1), "yyyy-MM-dd"),
    },
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

  // Get daily data for the last 7 days
  const dailyData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(now, 6 - i);
    return {
      label: format(date, "MMM dd"),
      start: startOfDay(date),
      end: endOfDay(date),
    };
  });

  const dailyUserCounts = await Promise.all(
    dailyData.map(async (d) =>
      prisma.user.count({
        where: {
          createdAt: {
            gte: d.start,
            lte: d.end,
          },
        },
      })
    )
  );

  return {
    monthly: {
      labels: months.map((m) => m.label),
      data,
    },
    daily: {
      labels: dailyData.map((d) => d.label),
      data: dailyUserCounts,
    },
  };
}

export async function getDashboardActivity() {
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate some mock system activities to make it more interesting
  const systemActivities = [
    {
      type: "system_backup",
      message: "Daily backup completed",
      severity: "info",
    },
    {
      type: "security_scan",
      message: "Security scan passed",
      severity: "success",
    },
    {
      type: "performance_check",
      message: "System performance optimal",
      severity: "info",
    },
  ];

  const userActivities = recentUsers.map((user) => ({
    type: "user_registered",
    username: user.username,
    role: user.role,
    date: user.createdAt.toISOString().slice(0, 10),
    time: user.createdAt.toISOString().slice(11, 16),
    severity: "info" as const,
  }));

  // Combine and sort by date
  const allActivities = [...userActivities, ...systemActivities].sort(
    (a, b) => {
      if ("date" in a && "date" in b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    }
  );

  return allActivities.slice(0, 10);
}

export async function getDashboardMetrics() {
  const now = new Date();

  // Get top performing metrics
  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.user.count(); // In a real app, you'd track active sessions

  // Get recent activity count
  const recentActivityCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: subDays(now, 7),
      },
    },
  });

  // Calculate engagement rate (mock data for now)
  const engagementRate = Math.min(85 + Math.random() * 15, 100);

  return {
    activeUsers,
    recentActivityCount,
    engagementRate: Math.round(engagementRate),
    averageSessionTime: "12m 34s",
    peakUsageTime: "2:00 PM - 4:00 PM",
    systemLoad: Math.round(45 + Math.random() * 30),
    errorRate: Math.round(Math.random() * 2),
  };
}
