import {
  FiUser,
  FiShield,
  FiActivity,
  FiCheckCircle,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  type: string;
  username?: string;
  role?: string;
  date?: string;
  time?: string;
  message?: string;
  severity: "info" | "success" | "warning" | "error";
}

interface EnhancedActivityFeedProps {
  activity: ActivityItem[];
}

export default function EnhancedActivityFeed({
  activity,
}: EnhancedActivityFeedProps) {
  const getActivityIcon = (type: string, severity: string) => {
    switch (type) {
      case "user_registered":
        return <FiUser className="w-4 h-4" />;
      case "system_backup":
        return <FiShield className="w-4 h-4" />;
      case "security_scan":
        return <FiCheckCircle className="w-4 h-4" />;
      case "performance_check":
        return <FiActivity className="w-4 h-4" />;
      default:
        return <FiInfo className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getActivityMessage = (item: ActivityItem) => {
    if (item.message) return item.message;

    switch (item.type) {
      case "user_registered":
        return `${item.username} (${item.role}) joined the platform`;
      case "system_backup":
        return "Daily backup completed successfully";
      case "security_scan":
        return "Security scan passed with no issues";
      case "performance_check":
        return "System performance check completed";
      default:
        return "Activity recorded";
    }
  };

  if (!activity || activity.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiActivity className="text-blue-500" />
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FiActivity className="text-blue-500" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activity.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div
              className={`p-2 rounded-full ${getSeverityColor(item.severity)}`}
            >
              {getActivityIcon(item.type, item.severity)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getActivityMessage(item)}
                </p>
                {item.date && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>

              {item.type === "user_registered" && item.username && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full">
                    {item.role}
                  </span>
                  {item.time && <span>at {item.time}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {activity.length} recent activities</span>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
