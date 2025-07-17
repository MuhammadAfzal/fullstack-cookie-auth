import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layout/AppLayout";
import RoleGate from "../components/RoleGate";
import { logout } from "../services/api";

export default function UserProfilePage() {
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
      <RoleGate allowedRoles={["USER", "ADMIN"]}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              👤 Your Profile
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Role:</strong>{" "}
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {user.role}
              </span>
            </p>
          </div>
        )}
      </RoleGate>
    </AppLayout>
  );
}
