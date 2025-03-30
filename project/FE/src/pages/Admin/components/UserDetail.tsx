import { FC, useState } from "react";
import UserPosts from "./UserPosts";
import UserMessages from "./UserMessages";
import UserComments from "./UserComments";
import ava from "@/assets/images/ava.png";
import iconWarning from "@/assets/images/icon-warning.png";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive";
  postsCount: number;
  messagesCount: number;
  commentsCount: number;
  lastActive: string;
}

interface UserDetailProps {
  user: User;
  onBack: () => void;
}

type Tab = "posts" | "messages" | "comments" | "info";

const UserDetail: FC<UserDetailProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [showNotification, setShowNotification] = useState(false);

  const handleBlockUser = () => {
    console.log(`Blocking user: ${user.name}`);

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex items-center">
        <button
          onClick={onBack}
          className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold">User Detail</h2>
      </div>

      <div className="p-6">
        <div className="flex items-start mb-6">
          <img
            src={ava}
            alt={user.name}
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h3 className="text-2xl font-bold">{user.name}</h3>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <div className="flex items-center mb-3">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.status === "active" ? "Active" : "Inactive"}
              </span>
              <span className="text-gray-500 ml-4">
                Last Active: {user.lastActive}
              </span>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <span className="text-blue-500 mr-1">📝</span> {user.postsCount}{" "}
                posts
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">💬</span>{" "}
                {user.messagesCount} messages
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">💭</span>{" "}
                {user.commentsCount} comments
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <button
              className="px-4 py-2 bg-red-400 text-white rounded-2xl hover:bg-red-500 active:bg-red-600 transition-colors"
              onClick={handleBlockUser}
            >
              Block
            </button>
          </div>
        </div>

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
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts ({user.postsCount})
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "messages"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("messages")}
            >
              Messages ({user.messagesCount})
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "comments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("comments")}
            >
              Comments ({user.commentsCount})
            </button>
          </nav>
        </div>

        {activeTab === "info" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Personal Info</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p>{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>0123456789</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined Date</p>
                  <p>01/01/2023</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">📝</span>
                  <div>
                    <p className="font-medium">New Post</p>
                    <p className="text-sm text-gray-500">Today, 10:30</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-yellow-500">💭</span>
                  <div>
                    <p className="font-medium">
                      Bình luận về bài viết "Hướng dẫn sử dụng React"
                    </p>
                    <p className="text-sm text-gray-500">Hôm qua, 15:45</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">💬</span>
                  <div>
                    <p className="font-medium">Nhắn tin cho Trần Thị B</p>
                    <p className="text-sm text-gray-500">Hôm qua, 09:20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && <UserPosts userId={user.id} />}
        {activeTab === "messages" && <UserMessages userId={user.id} />}
        {activeTab === "comments" && <UserComments userId={user.id} />}

        {showNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 transition-all duration-500">
            <div className="flex items-center">
              <div className="py-1">
                <img src={iconWarning} alt="Block user" className="w-8 mr-2" />
              </div>
              <div>
                <p className="font-bold">User Blocked</p>
                <p className="text-sm">
                  {user.name} has been blocked from using the application.
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
