import { FC, useState, useEffect } from "react";
import { getAllUsers } from "@/api/UserRequest";
import defaultAvatar from "@/assets/images/ava.png";
import searchIcon from "@assets/images/icon-search.png";

interface User {
  _id: string;
  fullname: string;
  username: string;
  email?: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
  postsCount?: number;
  messagesCount?: number;
  commentsCount?: number;
}

interface PaginationData {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UserListProps {
  onUserClick: (user: User) => void;
}

const UserList: FC<UserListProps> = ({ onUserClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(page, limit, searchQuery);

      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination(
          response.data.pagination || {
            totalUsers: 0,
            totalPages: 1,
            currentPage: page,
            limit,
          }
        );
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return `Today, ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return defaultAvatar;

    if (imagePath.startsWith("/images/")) {
      return `${serverPublic.replace("/images/", "")}${imagePath}`;
    }

    return `${serverPublic}${imagePath}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-xl font-semibold">User List</h2>
        <div className="flex items-center space-x-4">
          <div
            className={`flex overflow-hidden items-center w-full h-12 px-4 leading-none rounded-3xl border border-solid bg-zinc-100 transition-all duration-300 ${
              isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
            } text-zinc-900 max-md:px-5 max-md:max-w-full`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={searchIcon}
              alt="Search icon"
              className={`object-contain shrink-0 w-[16px] mr-1 transition-transform duration-300 ${
                isHovered ? "scale-110" : ""
              }`}
            />
            <input
              type="text"
              placeholder="Search user..."
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={getImageUrl(user.profilePic)}
                          alt={user.fullname}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultAvatar;
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email || user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                        <span className="mr-1">📝</span>
                        <span className="font-medium">
                          {user.postsCount || 0}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          posts
                        </span>
                      </div>
                      <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                        <span className="mr-1">💬</span>
                        <span className="font-medium">
                          {user.messagesCount || 0}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">msgs</span>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <span className="mr-1">💭</span>
                        <span className="font-medium">
                          {user.commentsCount || 0}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          comments
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                      onClick={() => onUserClick(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className={`px-3 py-1 rounded ${
                page === pagination.totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
