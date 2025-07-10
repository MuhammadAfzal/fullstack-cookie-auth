import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { User } from "../types";

interface Props {
  user: User | null;
  children: ReactNode;
}

export default function ProtectedRoute({ user, children }: Props) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
