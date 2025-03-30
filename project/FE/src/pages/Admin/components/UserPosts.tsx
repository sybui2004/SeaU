import { FC } from "react";

interface UserPostsProps {
  userId: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  status: "published" | "private" | "deleted";
}

const mockPosts: Record<number, Post[]> = {
  1: [
    {
      id: 1,
      title: "Cách học lập trình hiệu quả",
      content:
        "Lập trình là một kỹ năng quan trọng trong thời đại công nghệ...",
      date: "Hôm nay, 10:30",
      likes: 25,
      comments: 8,
      status: "published",
    },
    {
      id: 2,
      title: "Review sách: Clean Code",
      content:
        "Clean Code là một cuốn sách tuyệt vời cho mọi lập trình viên...",
      date: "Hôm qua, 15:20",
      likes: 42,
      comments: 15,
      status: "published",
    },
    {
      id: 3,
      title: "Các framework JavaScript phổ biến năm 2025",
      content:
        "Trong năm 2025, các framework JavaScript tiếp tục phát triển...",
      date: "3 ngày trước",
      likes: 18,
      comments: 5,
      status: "private",
    },
  ],
};

const UserPosts: FC<UserPostsProps> = ({ userId }) => {
  const posts = mockPosts[userId] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User Posts</h3>
        <select
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter posts by status"
          title="Filter posts by status"
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="private">Private</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <h4 className="text-lg font-medium">{post.title}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
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
              </div>
              <p className="text-gray-600 mt-2 mb-3 line-clamp-2">
                {post.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex space-x-4">
                  <span>{post.date}</span>
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments} comments</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            User has no posts.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts;
