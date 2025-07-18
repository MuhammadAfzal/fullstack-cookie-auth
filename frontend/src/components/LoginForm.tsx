import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { login } from "../services/api";
import FullScreenLoader from "./FullScreenLoader";
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

interface Props {
  onLogin: () => Promise<void>;
}

interface FormData {
  username: string;
  password: string;
}

export default function LoginForm({ onLogin }: Props) {
  const [form, setForm] = useState<FormData>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await login(form);
      await onLogin(); // ✅ This fetches the user from /me and sets in context
      showToast("✅ Login successful!", "success");
      setTransitioning(true);
      setTimeout(() => navigate("/dashboard"), 500);
    } catch {
      showToast("❌ Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  if (transitioning)
    return <FullScreenLoader message="Redirecting to dashboard..." />;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            name="username"
            autoFocus
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Remember me
          </span>
        </label>
        <a
          href="#"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl font-semibold text-white transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        }`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>Sign In</span>
            <FiArrowRight className="w-4 h-4" />
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </form>
  );
}
