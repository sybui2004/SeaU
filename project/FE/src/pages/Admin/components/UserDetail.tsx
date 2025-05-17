import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserPosts from "./UserPosts";
import UserMessages from "./UserMessages";
import UserComments from "./UserComments";
import defaultAvatar from "@/assets/images/ava.png";
import iconWarning from "@/assets/images/icon-warning.png";
import {
  deleteUser as deleteUserAPI,
  updateUserByAdmin,
} from "@/api/UserRequest";

interface User {
  _id: string;
  fullname: string;
  username: string;
  email?: string;
  profilePic?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  dob?: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
  postsCount?: number;
  messagesCount?: number;
  commentsCount?: number;
}

interface UserDetailProps {
  user: User;
}

type Tab = "posts" | "messages" | "comments" | "info" | "edit";

const UserDetail: FC<UserDetailProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [showNotification, setShowNotification] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();

  // Hàm xử lý đường dẫn hình ảnh
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return defaultAvatar;

    // Kiểm tra xem đường dẫn đã có /images/ chưa
    if (imagePath.startsWith("/images/")) {
      return `${serverPublic.replace("/images/", "")}${imagePath}`;
    }

    return `${serverPublic}${imagePath}`;
  };

  useEffect(() => {
    setEditedUser({
      fullname: user.fullname,
      username: user.username,
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      occupation: user.occupation || "",
      dob: user.dob ? user.dob.substring(0, 10) : "",
      language: user.language || "English",
    });

    if (user.profilePic) {
      setImagePreview(getImageUrl(user.profilePic));
    } else {
      setImagePreview(null);
    }

    setSelectedFile(null);
  }, [user, serverPublic]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!editedUser.fullname?.trim()) {
        toast.error("Fullname is required");
        return;
      }

      if (!editedUser.username?.trim()) {
        toast.error("Username is required");
        return;
      }

      setIsSaving(true);
      const formData = new FormData();

      Object.entries(editedUser).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const response = await updateUserByAdmin(user._id, formData);

      if (response.data) {
        toast.success("User information updated successfully");
        setActiveTab("info");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${user.fullname}? This action cannot be undone.`
      )
    ) {
      try {
        setIsDeleting(true);
        await deleteUserAPI(user._id);

        setShowNotification(true);
        toast.success(`User ${user.fullname} has been deleted successfully!`);

        setTimeout(() => {
          navigate("/admin/users");
        }, 2000);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again later.");
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex items-center">
        <h2 className="text-xl font-semibold">User Detail</h2>
        <div className="flex ml-auto">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 active:bg-blue-700 transition-colors mr-2"
            onClick={() => setActiveTab(activeTab === "edit" ? "info" : "edit")}
          >
            {activeTab === "edit" ? "Cancel" : "Edit User"}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 active:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete User
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab !== "edit" && (
          <div className="flex items-start mb-6">
            <img
              src={getImageUrl(user.profilePic)}
              alt={user.fullname}
              className="w-24 h-24 rounded-full mr-6 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultAvatar;
              }}
            />
            <div>
              <h3 className="text-2xl font-bold">{user.fullname}</h3>
              <p className="text-gray-600 mb-2">
                {user.email || user.username}
              </p>

              {user.phone && <p className="text-gray-600">📱 {user.phone}</p>}
              {user.address && (
                <p className="text-gray-600">🏠 {user.address}</p>
              )}

              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-1">📝</span>{" "}
                  {user.postsCount || 0} posts
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-1">💬</span>{" "}
                  {user.messagesCount || 0} messages
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">💭</span>{" "}
                  {user.commentsCount || 0} comments
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-b mb-4">
          <nav className="-mb-px flex">
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Info
            </button>
            {activeTab === "edit" ? (
              <button
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600`}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "posts"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  Posts ({user.postsCount || 0})
                </button>
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "messages"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  Messages ({user.messagesCount || 0})
                </button>
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "comments"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("comments")}
                >
                  Comments ({user.commentsCount || 0})
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Edit User Form */}
        {activeTab === "edit" && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Edit User Information
            </h3>
            <div className="mb-6 flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-full mb-2 cursor-pointer relative overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors"
                onClick={handleImageClick}
              >
                <img
                  src={imagePreview || defaultAvatar}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultAvatar;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">
                    Change Photo
                  </span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload profile picture"
                title="Choose a profile picture"
              />
              <p className="text-sm text-gray-500">
                Click to upload a new profile picture
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={editedUser.fullname || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="user-dob"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="user-dob"
                    type="date"
                    name="dob"
                    value={editedUser.dob || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Date of Birth"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editedUser.phone || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editedUser.address || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={editedUser.occupation || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Occupation"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="user-language"
                  >
                    Language
                  </label>
                  <select
                    id="user-language"
                    name="language"
                    value={editedUser.language || "English"}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select language"
                    title="Select your preferred language"
                  >
                    <option value="English">English</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className="px-6 py-2 ml-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Personal Info</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p>{user.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p>{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{user.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p>{user.occupation || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{user.dob ? formatDate(user.dob) : "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p>{user.language || "English"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined Date</p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">📝</span>
                  <div>
                    <p className="font-medium">Posts</p>
                    <p className="text-sm text-gray-500">
                      Total: {user.postsCount || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-yellow-500">💭</span>
                  <div>
                    <p className="font-medium">Comments</p>
                    <p className="text-sm text-gray-500">
                      Total: {user.commentsCount || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">💬</span>
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-gray-500">
                      Total: {user.messagesCount || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-purple-500">🕒</span>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && <UserPosts userId={user._id} />}
        {activeTab === "messages" && <UserMessages userId={user._id} />}
        {activeTab === "comments" && <UserComments userId={user._id} />}

        {showNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 transition-all duration-500">
            <div className="flex items-center">
              <div className="py-1">
                <img src={iconWarning} alt="Delete user" className="w-8 mr-2" />
              </div>
              <div>
                <p className="font-bold">User Deleted</p>
                <p className="text-sm">
                  {user.fullname} has been permanently deleted from the system.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
