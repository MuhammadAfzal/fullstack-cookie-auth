import LoginForm from "../components/LoginForm";
import { User } from "../types";

interface Props {
  onLogin: (userData: User) => void;
}

export default function LoginPage({ onLogin }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h2>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}
