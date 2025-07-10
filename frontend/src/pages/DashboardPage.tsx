import AppLayout from "../layout/AppLayout";
import { User } from "../types";
import DashboardChart from "../components/DashboardChart";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: Props) {
  return (
    <AppLayout user={user} onLogout={onLogout}>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username} 👋</h1>
      <p className="text-gray-700">Here’s your dashboard overview.</p>

      <DashboardChart />
    </AppLayout>
  );
}
