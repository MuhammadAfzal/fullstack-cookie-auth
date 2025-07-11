import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { login } from "../services/api";
import { User } from "../types";
import FullScreenLoader from "./FullScreenLoader";

interface Props {
  onLogin: (userData: User) => Promise<void>;
}

interface FormData {
  username: string;
  password: string;
}

export default function LoginForm({ onLogin }: Props) {
  const [form, setForm] = useState<FormData>({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await login(form);
      const userData: User = { username: form.username }; // Adjust this to match the User type definition
      await onLogin(userData);
      setSuccess(true);
      showToast("✅ Login successful!", "success");
      setTransitioning(true); // show spinner
      setTimeout(() => navigate("/dashboard"), 500); // smooth delay
    } catch {
      showToast("❌ Invalid credentials", "error");
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  if (transitioning)
    return <FullScreenLoader message="Redirecting to dashboard..." />;

  return (
    <form
      className="space-y-4 relative"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div>
        <label
          htmlFor="username"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          autoFocus
          placeholder="Enter your username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-500 dark:text-gray-300"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg transition-colors text-white font-medium ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="text-center text-sm">
        <a
          href="#"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Forgot password?
        </a>
      </div>
    </form>
  );
}
