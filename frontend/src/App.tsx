import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import { getProfile } from "./services/api";

function App() {
  const { user, setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await getProfile();
      setUser({ ...data.user });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BrowserRouter>
      <AppRoutes onLogin={handleLogin} />
    </BrowserRouter>
  );
}

export default App;
