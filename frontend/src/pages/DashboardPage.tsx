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
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome, {user.username} 👋
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <div className="text-gray-500 dark:text-gray-300 text-sm">
                Total Users
              </div>
              <div className="text-2xl font-bold">
                {summary?.totalUsers ?? "-"}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <div className="text-gray-500 dark:text-gray-300 text-sm">
                New Users This Month
              </div>
              <div className="text-2xl font-bold">
                {summary?.newUsersThisMonth ?? "-"}
              </div>
            </div>
            {/* Add more summary cards as needed */}
          </div>
          <DashboardChart chartData={chartData} />
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <ul className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 divide-y divide-gray-200 dark:divide-gray-700">
              {activity.length === 0 ? (
                <li className="text-gray-500 dark:text-gray-300">
                  No recent activity.
                </li>
              ) : (
                activity.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-2 text-gray-700 dark:text-gray-200"
                  >
                    {item.type === "user_registered" && (
                      <>
                        <span className="font-semibold">{item.username}</span>{" "}
                        registered on {item.date}
                      </>
                    )}
                    {/* Add more activity types as needed */}
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
