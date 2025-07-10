import { ReactNode } from "react";
import { User } from "../types";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";

interface Props {
  user: User;
  onLogout: () => void;
  children: ReactNode;
}

export default function AppLayout({ user, onLogout, children }: Props) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav user={user} onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
