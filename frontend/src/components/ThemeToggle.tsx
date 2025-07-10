import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center px-1 transition-colors duration-300"
      aria-label="Toggle dark mode"
    >
      <span
        className={`
          absolute left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
        `}
      />
      <span className="absolute left-1 text-xs text-yellow-500">
        <FiSun />
      </span>
      <span className="absolute right-1 text-xs text-blue-200">
        <FiMoon />
      </span>
    </button>
  );
}
