import { FC, useState, useEffect } from "react";
import { Loader2, Send, X } from "lucide-react";
import {
  getMessagesByUserId,
  updateMessageAsAdmin,
  deleteMessage,
} from "../../../api/MessageRequest";

interface UserMessagesProps {
  userId: string;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
  text: string;
  isDeleted: boolean;
  isEdited: boolean;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

const UserMessages: FC<UserMessagesProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const serverPublic =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        if (userId) {
          const response = await getMessagesByUserId(userId, currentPage, 10);

          if (response.data && response.data.messages) {
            const userMessages = response.data.messages.filter(
              (msg: Message) => msg.senderId._id === userId
            );
            setMessages(userMessages);

            const totalUserMessages = response.data.pagination.totalItems;
            setTotalMessages(totalUserMessages);

            const totalFilteredPages = Math.ceil(totalUserMessages / 10);
            setTotalPages(totalFilteredPages > 0 ? totalFilteredPages : 1);
          } else {
            setMessages([]);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(
          "An error occurred while fetching messages. Please try again later."
        );
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId, currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Today, ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/defaultProfile.png";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${serverPublic}${imagePath}`;
    }

    return `${serverPublic}/${imagePath}`;
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setEditText(message.text);
  };

  const handleUpdate = async () => {
    if (!editingMessage) return;

    try {
      const response = await updateMessageAsAdmin(editingMessage._id, {
        userId: userId,
        text: editText,
      });

      if (response.data && response.data.data) {
        setMessages(
          messages.map((msg) =>
            msg._id === editingMessage._id
              ? { ...msg, text: editText, isEdited: true }
              : msg
          )
        );
        setEditingMessage(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Failed to update message. Please try again.");
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const response = await deleteMessage(messageId, userId, true);

      if (response.data) {
        setMessages(
          messages.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  isDeleted: true,
                  text: "This message has been deleted",
                  attachments: [],
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  const confirmDelete = (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      handleDelete(messageId);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Messages Sent by User</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          This user hasn't sent any messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className={`border rounded-lg p-4 ${
                  message.isDeleted ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={getImageUrl(message.senderId.profilePic)}
                      alt={message.senderId.fullname}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/defaultProfile.png";
                      }}
                    />
                    <div>
                      <h4 className="font-medium">
                        {message.senderId.fullname}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center">
                    {message.isEdited && (
                      <span className="text-xs text-gray-500">(edited)</span>
                    )}
                  </div>
                </div>
                {editingMessage && editingMessage._id === message._id ? (
                  <div className="mt-3">
                    <textarea
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      aria-label="Edit message text"
                      placeholder="Enter your message..."
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-100"
                        onClick={() => setEditingMessage(null)}
                      >
                        <X size={16} className="inline mr-1" />
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleUpdate}
                        disabled={!editText.trim()}
                      >
                        <Send size={16} className="inline mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      className={`mt-3 ${
                        message.isDeleted
                          ? "italic text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {message.text}
                    </p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment, index) => (
                          <img
                            key={index}
                            src={getImageUrl(attachment)}
                            alt={`Attachment ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {!message.isDeleted && !editingMessage && (
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                      onClick={() => handleEdit(message)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline hover:bg-red-50 px-2 py-1 rounded"
                      onClick={() => confirmDelete(message._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No messages found.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-3 py-1 mx-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMessages;
