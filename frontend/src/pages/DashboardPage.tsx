import { Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { User } from "../types";
import DashboardChart from "../components/DashboardChart";

interface Props {
  user: User | null; // handle null case
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: Props) {
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppLayout user={user} onLogout={onLogout}>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Welcome, {user.username} 👋
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        Here’s your dashboard overview.
      </p>
      <DashboardChart />
    </AppLayout>
  );
}
