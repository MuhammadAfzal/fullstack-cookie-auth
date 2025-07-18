import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layout/AppLayout";
import RoleGate from "../components/RoleGate";
import { logout } from "../services/api";
import {
  FiUser,
  FiShield,
  FiCalendar,
  FiEdit,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

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
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                  <p className="text-blue-100">
                    Welcome to your profile dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiUser className="text-blue-500" />
                      Profile Information
                    </h2>
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <FiEdit className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Username
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {user.username}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Role
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Account Status
                      </span>
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <FiShield className="text-blue-500" />
                    Account Statistics
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Member Since
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            2024
                          </p>
                        </div>
                        <FiCalendar className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Login Streak
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            7 days
                          </p>
                        </div>
                        <FiUser className="w-6 h-6 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Profile Complete
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            85%
                          </p>
                        </div>
                        <FiShield className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <FiSettings className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Settings
                        </span>
                      </div>
                      <FiEdit className="w-4 h-4 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <FiShield className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Security
                        </span>
                      </div>
                      <FiEdit className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account
                  </h3>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </RoleGate>
    </AppLayout>
  );
}
