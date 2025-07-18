import { useLocation } from "react-router-dom";

export function usePageTitle(): string {
  const location = useLocation();

  switch (location.pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/profile":
      return "Profile";
    case "/admin":
      return "Admin Panel";
    case "/admin/users":
      return "All Users";
    case "/settings":
      return "Settings";
    default:
      return "Dashboard";
  }
}
