import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiUser, FiHome, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
    { to: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden p-4 text-gray-700 focus:outline-none"
        onClick={toggleMobile}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${mobileOpen ? "block" : "hidden"} md:flex
          flex-col bg-gray-100 transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          shadow-md h-screen
        `}
      >
        {/* Collapse toggle (desktop only) */}
        <div className="hidden md:flex justify-end p-2">
          <button
            onClick={toggleCollapse}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiMenu />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 px-2 py-4">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-200"
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
