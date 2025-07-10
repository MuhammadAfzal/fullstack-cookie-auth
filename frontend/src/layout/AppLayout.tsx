import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import { User } from "../types";

interface Props {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AppLayout({ user, onLogout, children }: Props) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={user} onLogout={onLogout} />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
