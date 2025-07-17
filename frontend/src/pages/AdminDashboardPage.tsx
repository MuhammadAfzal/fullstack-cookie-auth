import { useAuth } from "../context/AuthContext";
import AppLayout from "../layout/AppLayout";
import { logout } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Admin Panel
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Manage system settings and users.
      </p>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View All Users
        </button>

        {/* Add more admin tools here */}
        <button
          onClick={() => alert("System Settings")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          System Settings
        </button>
      </div>
    </AppLayout>
  );
}
