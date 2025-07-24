import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import { ApiProvider, useHealthContext } from "./context/ApiContext";
import { apiClient } from "./services/api";
import { useEffect } from "react";

// Component to test API Gateway connection
function ApiGatewayTest() {
  const { checkHealth, loading, error } = useHealthContext();

  // useEffect(() => {
  //   // Test the API Gateway connection on mount
  //   checkHealth().catch(console.error);
  // }, [checkHealth]);

  if (loading) {
    return (
      <div className="text-blue-600">Testing API Gateway connection...</div>
    );
  }

  if (error) {
    return <div className="text-red-600">API Gateway Error: {error}</div>;
  }

  // if (health) {
  //   return (
  //     <div className="text-green-600">
  //       ✅ API Gateway Connected: {health.message}
  //     </div>
  //   );
  // }

  return null;
}

function AppContent() {
  const { user, setUser } = useAuth();

  const handleLogin = async () => {
    try {
      // This will now go through the API Gateway
      const data = await apiClient.getProfile();
      setUser({ ...data.user });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* API Gateway Status */}
        <div className="bg-white shadow-sm border-b px-4 py-2">
          <ApiGatewayTest />
        </div>

        {/* Main App */}
        <AppRoutes onLogin={handleLogin} />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}

export default App;
