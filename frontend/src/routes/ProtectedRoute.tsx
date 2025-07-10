import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../types";

interface Props {
  user: User | null;
  children: ReactNode;
}

export default function ProtectedRoute({ user: propUser, children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}
