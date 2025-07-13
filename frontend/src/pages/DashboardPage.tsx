import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DashboardChart from "../components/DashboardChart";
import { logout } from "../services/api";

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
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
          <p className="text-gray-700 dark:text-gray-300">
            Here’s your dashboard overview.
          </p>
          <DashboardChart />
        </>
      )}
    </AppLayout>
  );
}
