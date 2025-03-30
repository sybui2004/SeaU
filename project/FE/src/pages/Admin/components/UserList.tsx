import { FC, useState } from "react";
import ava from "@/assets/images/ava.png";
import searchIcon from "@assets/images/icon-search.png";

interface User {
  id: number;
  name: string;
  email: string;
  // avatar: string;
  status: "active" | "inactive";
  postsCount: number;
  messagesCount: number;
  commentsCount: number;
  lastActive: string;
}

interface UserListProps {
  onUserClick: (user: User) => void;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    status: "active",
    postsCount: 3,
    messagesCount: 3,
    commentsCount: 3,
    lastActive: "Hôm nay, 10:45",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",

    status: "active",
    postsCount: 0,
    messagesCount: 0,
    commentsCount: 0,
    lastActive: "Hôm nay, 09:30",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",

    status: "inactive",
    postsCount: 0,
    messagesCount: 0,
    commentsCount: 0,
    lastActive: "Hôm qua, 15:20",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",

    status: "active",
    postsCount: 0,
    messagesCount: 0,
    commentsCount: 0,
    lastActive: "Hôm nay, 11:15",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",

    status: "inactive",
    postsCount: 0,
    messagesCount: 0,
    commentsCount: 0,
    lastActive: "3 ngày trước",
  },
];

const UserList: FC<UserListProps> = ({ onUserClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isHovered, setIsHovered] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA7EC]"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
            aria-label="Filter user status"
            title="Filter users by status"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onUserClick(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={ava}
                        alt={user.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-1">📝</span>{" "}
                      {user.postsCount}
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-1">💬</span>{" "}
                      {user.messagesCount}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">💭</span>{" "}
                      {user.commentsCount}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
