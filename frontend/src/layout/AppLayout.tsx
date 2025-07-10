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
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
