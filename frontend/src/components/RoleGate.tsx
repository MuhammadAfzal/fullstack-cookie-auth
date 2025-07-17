import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RoleGateProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGate({
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>; // Optional fallback UI
  }

  return <>{children}</>;
}

