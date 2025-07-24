import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DashboardChart from "../components/DashboardChart";
import DashboardStats from "../components/DashboardStats";
import EnhancedActivityFeed from "../components/EnhancedActivityFeed";
import { apiClient } from "../services/api";
import { FiUsers, FiUserPlus, FiActivity } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryRes, chartRes, activityRes, metricsRes] =
          await Promise.all([
            apiClient.getDashboardSummary(),
            apiClient.getDashboardChartData(),
            apiClient.getDashboardActivity(),
            apiClient.getDashboardMetrics(),
          ]);
        setSummary(summaryRes);
        setChartData(chartRes);
        setActivity(activityRes);
        setMetrics(metricsRes);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user.username}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's what's happening with your application today
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Last updated</p>
                  <p className="font-semibold">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats summary={summary} metrics={metrics} />

          {/* Charts and Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <DashboardChart chartData={chartData} />
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <EnhancedActivityFeed activity={activity} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <FiUsers className="w-5 h-5" />
                <span className="font-medium">View All Users</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <FiUserPlus className="w-5 h-5" />
                <span className="font-medium">Add New User</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <FiActivity className="w-5 h-5" />
                <span className="font-medium">View Reports</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
