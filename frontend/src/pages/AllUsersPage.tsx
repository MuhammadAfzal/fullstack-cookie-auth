import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import RoleGate from "../components/RoleGate";
import AppLayout from "../layout/AppLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../services/api";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users", err);
        setLoading(false);
      });
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
      <RoleGate allowedRoles={["ADMIN"]}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            👥 All Registered Users
          </h1>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No users found.</p>
          ) : (
            <div className="overflow-x-auto rounded shadow">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      ID
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Username
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr
                      key={u.id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {u.id}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {u.username}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            u.role === "ADMIN"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </RoleGate>
    </AppLayout>
  );
}
