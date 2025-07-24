// src/components/RegisterForm.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../services/api";
import { showToast } from "../utils/toast";
import { FiUser, FiLock, FiCheck, FiArrowRight } from "react-icons/fi";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await apiClient.register(form);
      showToast("Registered successfully! 🎉", "success");
      navigate("/login");
    } catch (err: any) {
      if (err?.message?.includes("Username already exists")) {
        showToast("❌ Username is already taken", "error");
      } else {
        showToast(err.message || "Failed to register", "error");
      }
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.username &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword;

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
            name="username"
            placeholder="Choose a username"
            autoFocus
            onChange={handleChange}
            value={form.username}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            onChange={handleChange}
            value={form.password}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          required
        />
        <span>
          I agree to the{" "}
          <a
            href="#"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Privacy Policy
          </a>
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !isFormValid}
        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl font-semibold text-white transition-all duration-200 ${
          loading || !isFormValid
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        }`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating account...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>Create Account</span>
            <FiArrowRight className="w-4 h-4" />
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  );
}
