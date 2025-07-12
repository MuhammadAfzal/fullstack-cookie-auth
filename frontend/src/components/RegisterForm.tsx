// src/components/RegisterForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { showToast } from "../utils/toast";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", password: "" });
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
      await register(form);
      showToast("Registered successfully! 🎉", "success");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Failed to register");
      showToast(err.message || "Failed to register", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        name="username"
        placeholder="Username"
        autoFocus
        onChange={handleChange}
        value={form.username}
        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={form.password}
        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
      />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
