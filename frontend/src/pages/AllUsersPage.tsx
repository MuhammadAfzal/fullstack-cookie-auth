import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import RoleGate from "../components/RoleGate";
import AppLayout from "../layout/AppLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const PAGE_SIZE = 50;

export default function AllUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isFetching = useRef(false);

  // Fetch users for a given page
  const fetchUsers = useCallback(async (pageNum: number) => {
    isFetching.current = true;
    const skip = pageNum * PAGE_SIZE;
    const res = await fetch(`/api/admin/users?skip=${skip}&take=${PAGE_SIZE}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (pageNum === 0) {
      setUsers(data.users);
    } else {
      setUsers((prev) => [...prev, ...data.users]);
    }
    setTotal(data.total);
    isFetching.current = false;
    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUsers(0);
    setPage(0);
  }, [fetchUsers]);

  // Load more users when scrolling near the end
  const handleScroll = ({
    scrollOffset,
    scrollDirection,
  }: ListOnScrollProps) => {
    if (
      scrollDirection === "forward" &&
      users.length < total &&
      !isFetching.current
    ) {
      // If within 10 rows of the end, load more
      const visibleRows = Math.ceil(600 / 56); // 600px height, 56px row height
      if (scrollOffset / 56 + visibleRows >= users.length - 10) {
        setLoadingMore(true);
        fetchUsers(page + 1);
        setPage((p) => p + 1);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: any }) => {
    const u = users[index];
    if (!u) return null;
    return (
      <div
        style={style}
        className="flex border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 items-center"
      >
        <div className="w-1/6 px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
          {u.id}
        </div>
        <div className="w-3/6 px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
          {u.username}
        </div>
        <div className="w-2/6 px-4 py-3 text-sm">
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
              u.role === "ADMIN"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {u.role}
          </span>
        </div>
      </div>
    );
  };

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <RoleGate allowedRoles={["ADMIN"]}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            👥 All Registered Users
          </h1>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex bg-gray-100 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200 text-sm">
                <div className="w-1/6 px-4 py-2">ID</div>
                <div className="w-3/6 px-4 py-2">Username</div>
                <div className="w-2/6 px-4 py-2">Role</div>
              </div>
              <div style={{ height: 600, width: "100%" }}>
                <List
                  height={600}
                  itemCount={users.length}
                  itemSize={56}
                  width={"100%"}
                  onScroll={handleScroll}
                >
                  {Row}
                </List>
                {loadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin h-6 w-6 rounded-full border-4 border-blue-500 border-t-transparent" />
                    <span className="ml-2 text-gray-500 dark:text-gray-300 text-sm">
                      Loading more...
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                Showing {users.length} of {total} users
              </div>
            </div>
          )}
        </div>
      </RoleGate>
    </AppLayout>
  );
}
