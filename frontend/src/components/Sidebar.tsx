import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiUser, FiHome, FiSettings, FiUsers } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/admin/users", label: "Users", icon: <FiUsers /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
    { to: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden p-4 text-gray-700 dark:text-gray-200 focus:outline-none"
        onClick={toggleMobile}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${mobileOpen ? "block" : "hidden"} md:flex
          flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          h-screen
          bg-gray-100 dark:bg-gray-900
          text-gray-800 dark:text-gray-100
          shadow-md
        `}
      >
        {/* Collapse toggle (desktop only) */}
        <div className="hidden md:flex justify-end p-2">
          <button
            onClick={toggleCollapse}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiMenu />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 px-2 py-4">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <span className="text-xl">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
