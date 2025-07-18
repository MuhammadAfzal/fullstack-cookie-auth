import {
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiShield,
  FiActivity,
  FiClock,
  FiZap,
} from "react-icons/fi";

interface DashboardStatsProps {
  summary: any;
  metrics: any;
}

export default function DashboardStats({
  summary,
  metrics,
}: DashboardStatsProps) {
  if (!summary || !metrics) return null;

  const getGrowthColor = (percentage: number) => {
    if (percentage > 0) return "text-green-600 dark:text-green-400";
    if (percentage < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getGrowthIcon = (percentage: number) => {
    if (percentage > 0) return "↗️";
    if (percentage < 0) return "↘️";
    return "→";
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary.totalUsers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {summary.averageUsersPerDay} avg/day this month
              </p>
            </div>
            <div className="p-3 bg-blue-500 text-white rounded-full">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                New This Month
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary.newUsersThisMonth}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`text-xs font-medium ${getGrowthColor(
                    summary.growthPercentage
                  )}`}
                >
                  {getGrowthIcon(summary.growthPercentage)}{" "}
                  {summary.growthPercentage}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  vs last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-500 text-white rounded-full">
              <FiUserPlus className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Active Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {metrics.activeUsers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {metrics.engagementRate}% engagement rate
              </p>
            </div>
            <div className="p-3 bg-purple-500 text-white rounded-full">
              <FiActivity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                System Health
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary.systemHealth.uptime}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last backup: {summary.systemHealth.lastBackup}
              </p>
            </div>
            <div className="p-3 bg-orange-500 text-white rounded-full">
              <FiShield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      {summary.roleDistribution && summary.roleDistribution.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Role Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.roleDistribution.map((role: any, index: number) => (
              <div
                key={role.role}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-green-500"
                        : index === 2
                        ? "bg-purple-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {role.role}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {role.count} users
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {role.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiZap className="text-blue-500" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                System Load
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.systemLoad}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Error Rate
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.errorRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Avg Session Time
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.averageSessionTime}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiClock className="text-green-500" />
            Usage Patterns
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Peak Usage
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.peakUsageTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Recent Activity
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.recentActivityCount} users
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                New Today
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {summary.newUsersToday}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
