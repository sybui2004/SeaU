import { FC } from "react";

interface UserCommentsProps {
  userId: number;
}

interface Comment {
  id: number;
  postTitle: string;
  content: string;
  date: string;
  likes: number;
  status: "approved" | "edited" | "deleted";
}

const mockComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      postTitle: "Cách học lập trình hiệu quả",
      content: "Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.",
      date: "Hôm nay, 11:25",
      likes: 8,
      status: "approved",
    },
    {
      id: 2,
      postTitle: "So sánh React và Angular",
      content:
        "Tôi đã dùng cả hai và thấy React phù hợp với dự án nhỏ hơn, còn Angular tốt cho enterprise.",
      date: "Hôm qua, 16:40",
      likes: 12,
      status: "approved",
    },
    {
      id: 3,
      postTitle: "Top 10 ngôn ngữ lập trình 2023",
      content: "Tôi nghĩ Rust xứng đáng xếp hạng cao hơn trong danh sách này.",
      date: "3 ngày trước",
      likes: 5,
      status: "edited",
    },
  ],
};

const UserComments: FC<UserCommentsProps> = ({ userId }) => {
  const comments = mockComments[userId] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User comments</h3>
        <select
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Lọc bình luận của người dùng"
          title="Filter user comments"
        >
          <option value="all">All comments</option>
          <option value="approved">Approved</option>
          <option value="edited">Edited</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <h4 className="font-medium">Comment on: {comment.postTitle}</h4>
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
              <p className="text-gray-600 mt-2 mb-3">{comment.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex space-x-4">
                  <span>{comment.date}</span>
                  <span>❤️ {comment.likes} likes</span>
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
            User has no comments.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComments;
