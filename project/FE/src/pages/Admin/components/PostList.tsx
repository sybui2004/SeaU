import { FC, useState } from "react";
import ava from "@assets/images/ava.png";
import searchIcon from "@assets/images/icon-search.png";
interface Post {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  status: "published" | "private" | "deleted";
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Cách học lập trình hiệu quả",
    author: {
      name: "Nguyễn Văn A",
      avatar: "",
    },
    category: "Learning",
    date: "Today, 10:30",
    views: 245,
    likes: 25,
    comments: 8,
    status: "published",
  },
  {
    id: 2,
    title: "Review sách: Clean Code",
    author: {
      name: "Trần Thị B",
      avatar: "",
    },
    category: "Book",
    date: "Yesterday, 15:20",
    views: 512,
    likes: 42,
    comments: 15,
    status: "published",
  },
  {
    id: 3,
    title: "Các framework JavaScript",
    author: {
      name: "Lê Văn C",
      avatar: "",
    },
    category: "Technology",
    date: "3 days ago",
    views: 187,
    likes: 18,
    comments: 5,
    status: "private",
  },
  {
    id: 4,
    title: "Kinh nghiệm làm việc với Next.js",
    author: {
      name: "Phạm Thị D",
      avatar: "",
    },
    category: "Technology",
    date: "1 week ago",
    views: 632,
    likes: 47,
    comments: 21,
    status: "published",
  },
  {
    id: 5,
    title: "Kinh nghiệm phỏng vấn xin việc IT",
    author: {
      name: "Hoàng Văn E",
      avatar: "",
    },
    category: "Job",
    date: "2 weeks ago",
    views: 924,
    likes: 76,
    comments: 32,
    status: "deleted",
  },
];

const PostList: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "private" | "deleted"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isHovered, setIsHovered] = useState(false);

  const categories = [
    "all",
    ...new Set(mockPosts.map((post) => post.category)),
  ];

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Post List</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <div
            className={`flex overflow-hidden items-center w-64 h-12 px-4 leading-none rounded-3xl border border-solid bg-zinc-100 transition-all duration-300 ${
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
              placeholder="Search post..."
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA7EC] ml-4"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "published" | "private" | "deleted"
              )
            }
            aria-label="Filter post status"
            title="Filter posts by status"
          >
            <option value="all">All status</option>
            <option value="published">Published</option>
            <option value="private">Private</option>
            <option value="deleted">Deleted</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA7EC]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter post category"
            title="Filter posts by category"
          >
            <option value="all">All categories</option>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={ava}
                        alt={post.author.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {post.author.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-1">👁️</span>{" "}
                      {post.views}
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-1">❤️</span> {post.likes}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">💬</span>{" "}
                      {post.comments}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : post.status === "private"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {post.status === "published"
                      ? "Published"
                      : post.status === "private"
                      ? "Private"
                      : "Deleted"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:underline mr-3">
                    View
                  </button>
                  {post.status !== "deleted" && (
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostList;
