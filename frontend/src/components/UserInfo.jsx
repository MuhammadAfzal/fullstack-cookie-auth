import { logout } from "../services/api";

export default function UserInfo({ user, onLogout }) {
  const handleLogout = async () => {
    await logout();
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
