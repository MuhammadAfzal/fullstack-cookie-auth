import LoginForm from "../components/LoginForm";

interface Props {
  onLogin: () => Promise<void>;
}

export default function LoginPage({ onLogin }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}
