import { FC, useState } from "react";
import searchIcon from "@assets/images/icon-search.png";
import ava from "@assets/images/ava.png";

interface Comment {
  id: number;
  post: {
    id: number;
    title: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  time: string;
  likes: number;
  status: "approved" | "edited" | "deleted";
}

const mockComments: Comment[] = [
  {
    id: 1,
    post: {
      id: 1,
      title: "Cách học lập trình hiệu quả",
    },
    author: {
      name: "Nguyễn Văn A",
      avatar: "",
    },
    content: "Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.",
    date: "Hôm nay",
    time: "11:25",
    likes: 8,
    status: "approved",
  },
  {
    id: 2,
    post: {
      id: 2,
      title: "So sánh React và Angular",
    },
    author: {
      name: "Trần Thị B",
      avatar: "",
    },
    content: "Tuyệt vời",
    date: "Hôm qua",
    time: "16:40",
    likes: 12,
    status: "approved",
  },
  {
    id: 3,
    post: {
      id: 3,
      title: "Top 10 ngôn ngữ lập trình 2023",
    },
    author: {
      name: "Lê Văn C",
      avatar: "",
    },
    content: "Tôi nghĩ Rust xứng đáng xếp hạng cao hơn trong danh sách này.",
    date: "3 ngày trước",
    time: "09:15",
    likes: 5,
    status: "edited",
  },
  {
    id: 4,
    post: {
      id: 4,
      title: "Kinh nghiệm làm việc với Next.js",
    },
    author: {
      name: "Phạm Thị D",
      avatar: "",
    },
    content:
      "Bài viết rất chi tiết về các tính năng của Next.js. Tuy nhiên, cần bổ sung thêm về SSG và ISR.",
    date: "5 ngày trước",
    time: "14:20",
    likes: 15,
    status: "approved",
  },
  {
    id: 5,
    post: {
      id: 5,
      title: "Kinh nghiệm phỏng vấn xin việc IT",
    },
    author: {
      name: "Hoàng Văn E",
      avatar: "",
    },
    content:
      "Bài viết này đã giúp mình rất nhiều trong việc chuẩn bị phỏng vấn. Cảm ơn!",
    date: "1 tuần trước",
    time: "10:30",
    likes: 30,
    status: "deleted",
  },
];

const CommentList: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "edited" | "deleted"
  >("all");
  const [isHovered, setIsHovered] = useState(false);

  const filteredComments = mockComments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.post.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || comment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Comment List</h2>
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
              placeholder="Search comment..."
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search comment"
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA7EC]"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "approved" | "edited" | "deleted"
              )
            }
            aria-label="Filter comment status"
            title="Filter comments by status"
          >
            <option value="all">All status</option>
            <option value="approved">Approved</option>
            <option value="edited">Edited</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <img
                      src={ava}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">{comment.author.name}</div>
                      <p className="text-sm text-gray-500">
                        {comment.date}, {comment.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      comment.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : comment.status === "edited"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {comment.status === "approved"
                      ? "Approved"
                      : comment.status === "edited"
                      ? "Edited"
                      : "Deleted"}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-blue-600 mb-2">
                    Comment about:{" "}
                    <span className="font-medium">{comment.post.title}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-1">❤️</span> {comment.likes} likes
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>

                    {comment.status !== "deleted" && (
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments found that match the filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentList;
