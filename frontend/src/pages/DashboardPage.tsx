import { Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DashboardChart from "../components/DashboardChart";
import { useEffect, useState } from "react";
import { User } from "../types";

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // ✅ Redirect to login if user is not available
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout user={user} onLogout={onLogout}>
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
