import { apiClient } from "../services/api";
import { User } from "../types";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function UserInfo({ user, onLogout }: Props) {
  const handleLogout = async () => {
    await apiClient.logout();
    onLogout();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user.username}</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
