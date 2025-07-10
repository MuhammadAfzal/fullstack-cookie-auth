import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden p-4 focus:outline-none text-gray-600"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block bg-gray-100 w-full md:w-64 p-4 shadow-inner md:h-screen`}
      >
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/dashboard"
            className="text-gray-700 hover:text-blue-500"
          >
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
    </>
  );
}
