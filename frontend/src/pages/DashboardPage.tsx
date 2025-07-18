import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DashboardChart from "../components/DashboardChart";
import {
  logout,
  getDashboardSummary,
  getDashboardChartData,
  getDashboardActivity,
} from "../services/api";
import { FiUsers, FiUserPlus, FiActivity } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryRes, chartRes, activityRes] = await Promise.all([
          getDashboardSummary(),
          getDashboardChartData(),
          getDashboardActivity(),
        ]);
        setSummary(summaryRes);
        setChartData(chartRes);
        setActivity(activityRes);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
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
        <>
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">
            Welcome, {user.username} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Here’s a quick overview of your app’s activity and growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 shadow rounded-lg p-5">
              <div className="p-3 bg-blue-500 text-white rounded-full mr-4">
                <FiUsers size={28} />
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-300 text-xs uppercase font-semibold">
                  Total Users
                </div>
                <div className="text-2xl font-bold">
                  {summary?.totalUsers ?? "-"}
                </div>
              </div>
            </div>
            <div className="flex items-center bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 shadow rounded-lg p-5">
              <div className="p-3 bg-green-500 text-white rounded-full mr-4">
                <FiUserPlus size={28} />
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-300 text-xs uppercase font-semibold">
                  New This Month
                </div>
                <div className="text-2xl font-bold">
                  {summary?.newUsersThisMonth ?? "-"}
                </div>
              </div>
            </div>
            {/* Add more summary cards as needed */}
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              User Growth
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Track new user registrations over the past 6 months.
            </p>
            <DashboardChart chartData={chartData} />
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Recent Activity
            </h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {activity.length === 0 ? (
                <li className="text-gray-500 dark:text-gray-300 py-2">
                  No recent activity.
                </li>
              ) : (
                activity.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 py-3 text-gray-700 dark:text-gray-200"
                  >
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-full p-2">
                      <FiUserPlus size={20} />
                    </span>
                    <span className="font-semibold">{item.username}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      registered{" "}
                      {formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </AppLayout>
  );
}
