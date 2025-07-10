import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import UserInfo from "./components/UserInfo";
import { getProfile } from "./services/api";

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {user ? (
          <UserInfo user={user} onLogout={() => setUser(null)} />
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              Login
            </h2>
            <LoginForm onLogin={fetchUser} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
