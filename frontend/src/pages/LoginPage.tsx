import LoginForm from "../components/LoginForm";
import { FiShield, FiZap } from "react-icons/fi";

interface Props {
  onLogin: () => Promise<void>;
}

export default function LoginPage({ onLogin }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/50">
          <LoginForm onLogin={onLogin} />
        </div>

        {/* Features Section */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <FiZap className="w-4 h-4 text-blue-500" />
              <span>Fast & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiShield className="w-4 h-4 text-green-500" />
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
