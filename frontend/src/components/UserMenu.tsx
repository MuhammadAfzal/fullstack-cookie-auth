import { useState, useRef, useEffect } from "react";
import { User } from "../types";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = user?.username?.slice(0, 2)?.toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg py-2 z-10">
          <button
            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setOpen(false);
              // navigate("/profile"); // optional
            }}
          >
            Profile
          </button>
          <button
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
