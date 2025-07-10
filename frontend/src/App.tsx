import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { getProfile } from "./services/api";
import AppRoutes from "./routes/AppRoutes";
import { User } from "./types/";

function App() {
  const [user, setUser] = useState<User | null>(null);

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
    <BrowserRouter>
      <AppRoutes
        user={user}
        onLogin={fetchUser}
        onLogout={() => setUser(null)}
      />
    </BrowserRouter>
  );
}

export default App;
