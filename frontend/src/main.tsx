import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="system" // 'light' | 'dark' | 'system'
          toastOptions={{
            classNames: {
              toast: "rounded-md shadow-md text-sm",
              title: "font-medium",
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
