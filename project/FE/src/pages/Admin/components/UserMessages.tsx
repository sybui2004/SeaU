import { FC } from "react";
import ava from "@assets/images/ava.png";
interface UserMessagesProps {
  userId: number;
}

interface Message {
  id: number;
  recipientName: string;
  recipientAvatar: string;
  content: string;
  date: string;
  status: "sent" | "received" | "read";
}

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      recipientName: "Trần Thị B",
      recipientAvatar: "",
      content: "Chào bạn, mình muốn hỏi về khóa học React mà bạn đang học...",
      date: "Hôm nay, 09:45",
      status: "sent",
    },
    {
      id: 2,
      recipientName: "Lê Văn C",
      recipientAvatar: "",
      content: "Cảm ơn bạn đã chia sẻ bài viết. Mình thấy rất hữu ích!",
      date: "Hôm qua, 14:30",
      status: "received",
    },
    {
      id: 3,
      recipientName: "Phạm Thị D",
      recipientAvatar: "",
      content:
        "Đã nhận được tài liệu bạn gửi. Tối nay mình sẽ đọc và phản hồi.",
      date: "2 ngày trước",
      status: "read",
    },
  ],
};

const UserMessages: FC<UserMessagesProps> = ({ userId }) => {
  const messages = mockMessages[userId] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User Messages</h3>
        <select
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter user messages"
          title="Filter messages by status"
        >
          <option value="all">All Messages</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={ava}
                    alt={message.recipientName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{message.recipientName}</h4>
                    <p className="text-sm text-gray-500">{message.date}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    message.status === "sent"
                      ? "bg-blue-100 text-blue-800"
                      : message.status === "received"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {message.status === "sent"
                    ? "Sent"
                    : message.status === "received"
                    ? "Received"
                    : "Read"}
                </span>
              </div>
              <p className="mt-3 text-gray-700">{message.content}</p>
              <div className="flex justify-end mt-2 space-x-2">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessages;
