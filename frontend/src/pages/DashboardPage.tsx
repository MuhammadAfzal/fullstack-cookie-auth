import UserInfo from "../components/UserInfo";

import { User } from "../types";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <UserInfo user={user} onLogout={onLogout} />
      </div>
    </div>
  );
}
