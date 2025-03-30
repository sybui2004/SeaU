import { FC, useState } from "react";
import ava from "@assets/images/ava.png";
import searchIcon from "@assets/images/icon-search.png";
interface Message {
  id: number;
  sender: {
    name: string;
    avatar: string;
  };
  receiver: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  time: string;
  status: "sent" | "edited" | "read" | "deleted";
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: {
      name: "Nguyễn Văn A",
      avatar: "",
    },
    receiver: {
      name: "Trần Thị B",
      avatar: "",
    },
    content: "Chào bạn, mình muốn hỏi về khóa học React mà bạn đang học...",
    date: "Hôm nay",
    time: "09:45",
    status: "sent",
  },
  {
    id: 2,
    sender: {
      name: "Trần Thị B",
      avatar: "",
    },
    receiver: {
      name: "Nguyễn Văn A",
      avatar: "",
    },
    content:
      "Chào bạn, khóa học mà mình đang học là ReactJS cơ bản đến nâng cao trên website...",
    date: "Hôm nay",
    time: "10:15",
    status: "read",
  },
  {
    id: 3,
    sender: {
      name: "Lê Văn C",
      avatar: "",
    },
    receiver: {
      name: "Phạm Thị D",
      avatar: "",
    },
    content: "Cảm ơn bạn đã chia sẻ bài viết. Mình thấy rất hữu ích!",
    date: "Hôm qua",
    time: "14:30",
    status: "edited",
  },
  {
    id: 4,
    sender: {
      name: "Phạm Thị D",
      avatar: "",
    },
    receiver: {
      name: "Hoàng Văn E",
      avatar: "",
    },
    content: "Đã nhận được tài liệu bạn gửi. Tối nay mình sẽ đọc và phản hồi.",
    date: "2 ngày trước",
    time: "16:45",
    status: "read",
  },
  {
    id: 5,
    sender: {
      name: "Hoàng Văn E",
      avatar: "",
    },
    receiver: {
      name: "Nguyễn Văn A",
      avatar: "",
    },
    content: "Bạn có thể gửi cho mình link GitHub repository của dự án không?",
    date: "3 ngày trước",
    time: "08:20",
    status: "deleted",
  },
];

const MessageList: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "sent" | "edited" | "read" | "deleted"
  >("all");
  const [isHovered, setIsHovered] = useState(false);

  const filteredMessages = mockMessages.filter((message) => {
    const matchesSearch =
      message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.receiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Message List</h2>
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
              placeholder="Search message..."
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA7EC]"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "sent" | "edited" | "read" | "deleted"
              )
            }
            aria-label="Filter message status"
            title="Filter messages by status"
          >
            <option value="all">All status</option>
            <option value="sent">Sent</option>
            <option value="edited">Edited</option>
            <option value="read">Read</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={ava}
                      alt={message.sender.name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="mx-2">→</span>
                    <img
                      src={ava}
                      alt={message.receiver.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">
                        {message.sender.name} → {message.receiver.name}
                      </div>
                      <p className="text-sm text-gray-500">
                        {message.date}, {message.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      message.status === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : message.status === "edited"
                        ? "bg-yellow-100 text-yellow-800"
                        : message.status === "read"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {message.status === "sent"
                      ? "Sent"
                      : message.status === "edited"
                      ? "Edited"
                      : message.status === "read"
                      ? "Read"
                      : "Deleted"}
                  </span>
                </div>
                <p className="mt-3 text-gray-700">{message.content}</p>
                <div className="flex justify-end mt-2 space-x-2">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                  {message.status !== "deleted" && (
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No messages found that match the filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
