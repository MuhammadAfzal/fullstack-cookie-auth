import { User } from "../types";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { usePageTitle } from "../hooks/usePageTitle";

interface Props {
  user: User;
  onLogout: () => void;
}

export default function TopNav({ user, onLogout }: Props) {
  const pageTitle = usePageTitle();

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700">
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        {pageTitle}
      </span>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  );
}
