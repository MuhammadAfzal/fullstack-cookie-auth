import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import { User } from "../types";

interface Props {
  user: User | null;
  onLogin: () => Promise<void>;
  onLogout: () => void;
}

export default function AppRoutes({ user, onLogin, onLogout }: Props) {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage user={user as User} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}
