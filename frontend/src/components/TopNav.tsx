import { User } from "../types";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function TopNav({ user, onLogout }: Props) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b">
      <span className="text-lg font-semibold">My Dashboard</span>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user.username}</span>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
