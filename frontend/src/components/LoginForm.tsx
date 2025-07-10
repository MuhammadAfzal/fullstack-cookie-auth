import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

interface Props {
  onLogin: () => Promise<void>;
}

interface FormData {
  username: string;
  password: string;
}

export default function LoginForm({ onLogin }: Props) {
  const [form, setForm] = useState<FormData>({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await login(form);
      await onLogin();
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="space-y-4">
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  );
}
