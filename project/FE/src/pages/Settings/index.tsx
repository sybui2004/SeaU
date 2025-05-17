import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "@/components/layout/Sidebar";
import axios from "axios";

const Settings = () => {
  const { user } = useSelector((state: any) => state.authReducer.authData);
  const token = useSelector((state: any) => state.authReducer.authData.token);
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 3) {
      setError("Password must be at least 3 characters long");
      return;
    }

    setLoading(true);

    try {
      const verifyResponse = await axios.post(
        `${API_BASE_URL}/auth/verify-password`,
        {
          userId: user._id,
          password: oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!verifyResponse.data.success) {
        setError("Current password is incorrect");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/user/${user._id}`,
        {
          currentUserId: user._id,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password updated successfully");

      try {
        const profile = JSON.parse(localStorage.getItem("profile") || "{}");
        if (profile.user && profile.user._id === user._id) {
          profile.user = { ...profile.user, ...response.data };
          localStorage.setItem("profile", JSON.stringify(profile));
        }
      } catch (e) {
        console.error("Error updating local storage:", e);
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);

      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setError("Current password is incorrect");
        } else if (
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          setError(error.response.data);
        } else {
          setError("Failed to update password. Please try again later.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen dark:bg-gray-900">
      <Sidebar />
      <div className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 dark:text-white">
            Settings
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 dark:bg-gray-800">
            <h2 className="text-xl font-medium text-gray-700 mb-4 dark:text-gray-200">
              Appearance
            </h2>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="darkMode"
                  id="darkMode"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  aria-label="Toggle dark mode"
                />
                <label
                  htmlFor="darkMode"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    darkMode ? "bg-blue-500" : ""
                  }`}
                >
                  <span
                    className={`dot block h-6 w-6 rounded-full bg-white border border-gray-300 shadow transform transition-transform duration-200 ease-in-out ${
                      darkMode ? "translate-x-6" : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <h2 className="text-xl font-medium text-gray-700 mb-4 dark:text-gray-200">
              Security
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">
                  Current Password
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                    isHovered.oldPassword
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden dark:bg-gray-700 dark:text-white`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, oldPassword: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, oldPassword: false }))
                  }
                >
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">
                  New Password
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                    isHovered.newPassword
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden dark:bg-gray-700 dark:text-white`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, newPassword: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, newPassword: false }))
                  }
                >
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">
                  Confirm New Password
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                    isHovered.confirmPassword
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden dark:bg-gray-700 dark:text-white`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, confirmPassword: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({
                      ...prev,
                      confirmPassword: false,
                    }))
                  }
                >
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#1CA7EC] to-[#4ADEDE] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
                }`}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
