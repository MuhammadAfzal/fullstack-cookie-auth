import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AllUsersPage from "../pages/AllUsersPage";
import UserProfilePage from "../pages/UserProfilePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import { ApiGatewayTestPage } from "../pages/ApiGatewayTestPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { Role } from "../constants/roles";

interface Props {
  onLogin: () => Promise<void>;
}

export default function AppRoutes({ onLogin }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/test-api" element={<ApiGatewayTestPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AllUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}
