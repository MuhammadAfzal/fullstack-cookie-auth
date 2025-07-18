import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layout/AppLayout";
import RoleGate from "../components/RoleGate";
import {
  logout,
  getProfileData,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "../services/api";
import {
  FiUser,
  FiShield,
  FiCalendar,
  FiEdit,
  FiSettings,
  FiLogOut,
  FiCamera,
  FiX,
  FiSave,
  FiMail,
  FiPhone,
  FiFileText,
} from "react-icons/fi";
import { showToast } from "../utils/toast";

interface ProfileData {
  id: number;
  username: string;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phone: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await getProfileData();
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        bio: profileData.bio || "",
        phone: profileData.phone || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to original values
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const updatedProfile = await uploadAvatar(file);
      setProfile(updatedProfile);
      showToast("Avatar uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload avatar", "error");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const updatedProfile = await deleteAvatar();
      setProfile(updatedProfile);
      showToast("Avatar removed successfully!", "success");
    } catch (err: any) {
      showToast("Failed to remove avatar", "error");
    }
  };

  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    return `http://localhost:5000/api/uploads/avatars/${avatar}`;
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <RoleGate allowedRoles={["USER", "ADMIN"]}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {profile?.avatar ? (
                      <img
                        src={getAvatarUrl(profile.avatar)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-12 h-12" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                  {profile?.avatar && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {profile?.firstName && profile?.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile?.username}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {profile?.bio || "No bio yet"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Member since</p>
                  <p className="font-semibold">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiUser className="text-blue-500" />
                  Profile Information
                </h2>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <FiSave className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiFileText className="w-4 h-4" />
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!editing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiShield className="text-blue-500" />
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Username
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profile?.username}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Role
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        profile?.role === "ADMIN"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {profile?.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiCalendar className="text-green-500" />
                  Account Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Created
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Last Updated
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profile?.updatedAt
                        ? new Date(profile.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiSettings className="text-purple-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <FiSettings className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Settings
                      </span>
                    </div>
                    <FiEdit className="w-4 h-4 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <FiShield className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Security
                      </span>
                    </div>
                    <FiEdit className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden file input for avatar upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        )}
      </RoleGate>
    </AppLayout>
  );
}
