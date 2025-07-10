import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 h-screen shadow-inner p-4">
      <nav className="flex flex-col space-y-4">
        <NavLink to="/dashboard" className="text-gray-700 hover:text-blue-500">
          Dashboard
        </NavLink>
        <NavLink to="/profile" className="text-gray-700 hover:text-blue-500">
          Profile
        </NavLink>
        <NavLink to="/settings" className="text-gray-700 hover:text-blue-500">
          Settings
        </NavLink>
      </nav>
    </div>
  );
}
