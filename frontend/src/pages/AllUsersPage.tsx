import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import RoleGate from "../components/RoleGate";
import AppLayout from "../layout/AppLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import {
  FiUser,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiX,
} from "react-icons/fi";

const PAGE_SIZE = 50;

function getInitials(username: string) {
  return username?.slice(0, 2).toUpperCase();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isFetching = useRef(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [viewUser, setViewUser] = useState<any | null>(null);

  // Fetch users for a given page
  const fetchUsers = useCallback(async (pageNum: number) => {
    isFetching.current = true;
    const skip = pageNum * PAGE_SIZE;
    const data = await apiClient.getAllUsers(skip, PAGE_SIZE);
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

  // Filter users by search
  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, users]);

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
      const visibleRows = Math.ceil(500 / 64); // 500px height, 64px row height
      if (scrollOffset / 64 + visibleRows >= users.length - 10) {
        setLoadingMore(true);
        fetchUsers(page + 1);
        setPage((p) => p + 1);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // User action handlers
  const handleView = (u: any) => {
    setViewUser(u);
  };
  const handleEdit = (u: any) => {
    alert(`Edit user: ${u.username}`);
  };
  const handleDelete = (u: any) => {
    if (window.confirm(`Are you sure you want to delete user ${u.username}?`)) {
      alert(`Deleted user: ${u.username}`);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: any }) => {
    const u = filteredUsers[index];
    if (!u) return null;
    return (
      <div
        style={style}
        className="flex items-center border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors px-0 md:px-2"
        role="row"
        tabIndex={0}
        aria-label={`User ${u.username}`}
      >
        <div className="w-1/12 flex items-center gap-2 px-2 py-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-800 flex items-center justify-center text-lg font-bold text-blue-700 dark:text-blue-200">
            <FiUser className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {u.id}
          </span>
        </div>
        <div className="w-3/12 px-2 py-3 text-base font-medium text-gray-900 dark:text-gray-100 truncate">
          {u.username}
        </div>
        <div className="w-3/12 px-2 py-3 text-sm text-gray-700 dark:text-gray-300 truncate">
          {u.email || <span className="italic text-gray-400">No email</span>}
        </div>
        <div className="w-2/12 px-2 py-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
              u.role === "ADMIN"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {u.role}
          </span>
        </div>
        <div className="w-2/12 px-2 py-3 text-xs text-gray-500 dark:text-gray-400">
          {formatDate(u.createdAt)}
        </div>
        <div className="w-1/12 flex items-center gap-2 px-2 py-3 justify-end">
          <button
            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            title="View"
            aria-label="View user"
            onClick={() => handleView(u)}
          >
            <FiEye className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
            title="Edit"
            aria-label="Edit user"
            onClick={() => handleEdit(u)}
          >
            <FiEdit2 className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
            title="Delete"
            aria-label="Delete user"
            onClick={() => handleDelete(u)}
          >
            <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </div>
    );
  };

  // User details modal
  const UserModal = ({ user, onClose }: { user: any; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-800 flex items-center justify-center text-4xl font-bold text-blue-700 dark:text-blue-200 shadow-lg">
            <FiUser className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : user.username}
          </h2>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm mb-2 mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {user.role}
          </span>
          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <FiMail className="w-4 h-4" />
              <span>
                {user.email || (
                  <span className="italic text-gray-400">No email</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <FiPhone className="w-4 h-4" />
              <span>
                {user.phone || (
                  <span className="italic text-gray-400">No phone</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <FiCalendar className="w-4 h-4" />
              <span>Joined: {formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Bio:</span>
              <span>
                {user.bio || (
                  <span className="italic text-gray-400">No bio</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <RoleGate allowedRoles={["ADMIN"]}>
        <div className="w-full max-w-[98vw] md:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[1400px] mx-auto px-0 md:px-2 py-6 md:py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-0 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-4 pt-6 md:px-0 md:pt-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                👥 All Registered Users
              </h1>
              <div className="relative w-full md:w-80">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search users"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="sticky top-0 z-10 flex bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 font-semibold text-gray-700 dark:text-gray-200 text-sm border-b border-gray-200 dark:border-gray-700">
                <div className="w-1/12 px-2 py-3">ID</div>
                <div className="w-3/12 px-2 py-3">Username</div>
                <div className="w-3/12 px-2 py-3">Email</div>
                <div className="w-2/12 px-2 py-3">Role</div>
                <div className="w-2/12 px-2 py-3">Joined</div>
                <div className="w-1/12 px-2 py-3 text-right">Actions</div>
              </div>
              <div style={{ height: 500, width: "100%" }}>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300 text-lg">
                      Loading users...
                    </span>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <FiUser className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                    <span className="text-gray-500 dark:text-gray-400 text-lg">
                      No users found.
                    </span>
                  </div>
                ) : (
                  <List
                    height={500}
                    itemCount={filteredUsers.length}
                    itemSize={64}
                    width={"100%"}
                    onScroll={handleScroll}
                  >
                    {Row}
                  </List>
                )}
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
                Showing {filteredUsers.length} of {total} users
              </div>
            </div>
          </div>
        </div>
        {viewUser && (
          <UserModal user={viewUser} onClose={() => setViewUser(null)} />
        )}
      </RoleGate>
    </AppLayout>
  );
}
