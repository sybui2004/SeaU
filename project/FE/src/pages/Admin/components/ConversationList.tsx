import { FC, useState, useEffect } from "react";
import { getAllConversationsForAdmin } from "@/api/ConversationRequest";
import {
  deleteMessage,
  updateMessageAsAdmin,
  getMessages,
} from "@/api/MessageRequest";
import defaultAvatar from "@/assets/images/ava.png";
import searchIcon from "@assets/images/icon-search.png";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, X, ArrowLeft, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Conversation {
  _id: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  name?: string;
  lastMessage?:
    | string
    | {
        _id: string;
        text: string;
        senderId: string;
        conversationId: string;
        createdAt: string;
        updatedAt: string;
        isDeleted: boolean;
        isEdited: boolean;
        fileType?: string;
        fileName?: string;
        fileSize?: number;
        fileData?: string;
      };
  memberDetails?: {
    _id: string;
    fullname: string;
    profilePic?: string;
  }[];
}

interface MessageWithPopulated {
  _id: string;
  conversationId: {
    _id: string;
    name?: string;
    isGroup: boolean;
  };
  senderId: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
  text: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ConversationList: FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<MessageWithPopulated[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [page, setPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [messagePagination, setMessagePagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );
  const [editingMessage, setEditingMessage] =
    useState<MessageWithPopulated | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const serverPublic =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";

  const { user } = useSelector((state: any) => state.authReducer.authData);

  const checkAdminPermission = () => {
    if (!user || !user.isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!checkAdminPermission()) {
      setError("Bạn không có quyền truy cập trang này");
      return;
    }
    fetchConversations();
  }, [page]);

  useEffect(() => {
    if (!checkAdminPermission()) return;

    const timer = setTimeout(() => {
      fetchConversations();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchConversations = async () => {
    if (!checkAdminPermission()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getAllConversationsForAdmin(page, 10, searchQuery);
      console.log("Conversations response:", response);

      if (response.data) {
        setConversations(response.data.conversations || []);
        setPagination(
          response.data.pagination || {
            currentPage: page,
            totalPages: 1,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      }
      setError(null);
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập dữ liệu này");
        toast.error("Bạn không có quyền truy cập dữ liệu này");
      } else {
        setError(
          "Không thể tải danh sách cuộc trò chuyện. Vui lòng thử lại sau."
        );
      }
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesForConversation = async (conversationId: string) => {
    if (!checkAdminPermission()) {
      toast.error("Bạn không có quyền xem tin nhắn");
      return;
    }

    try {
      setLoadingMessages(true);
      console.log("Fetching messages for conversation:", conversationId);

      const response = await getMessages(conversationId, messagePage, 10);

      console.log("Messages API response:", response);

      if (response.data) {
        const messagesData = response.data.messages || [];
        console.log("Messages data:", messagesData);

        if (!Array.isArray(messagesData)) {
          console.error("Messages data is not an array:", messagesData);
          toast.error("Định dạng dữ liệu không hợp lệ");
          setMessages([]);
          return;
        }

        const formattedMessages = messagesData
          .filter((msg: any) => msg !== null && msg !== undefined)
          .map((msg: any) => {
            // Kiểm tra senderId
            let senderInfo = {
              _id: "unknown",
              fullname: "Unknown User",
              profilePic: undefined,
            };

            if (msg.senderId) {
              if (typeof msg.senderId === "object") {
                senderInfo = {
                  _id: msg.senderId._id || "unknown",
                  fullname: msg.senderId.fullname || "Unknown User",
                  profilePic: msg.senderId.profilePic,
                };
              } else {
                senderInfo = {
                  _id: msg.senderId,
                  fullname: "User",
                  profilePic: undefined,
                };
              }
            }

            return {
              _id: msg._id || `temp-${Date.now()}`,
              conversationId: msg.conversationId || {
                _id: conversationId,
                isGroup: false,
              },
              senderId: senderInfo,
              text:
                typeof msg.text === "object"
                  ? msg.text.text || "A file"
                  : msg.text || "A file",
              attachments: Array.isArray(msg.attachments)
                ? msg.attachments
                : [],
              createdAt: msg.createdAt || new Date().toISOString(),
              updatedAt: msg.updatedAt || new Date().toISOString(),
              isEdited: Boolean(msg.isEdited),
              isDeleted: Boolean(msg.isDeleted),
            } as MessageWithPopulated;
          });

        setMessages(formattedMessages);
        setMessagePagination(
          response.data.pagination || {
            currentPage: messagePage,
            totalPages: 1,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } else {
        console.error("No data in API response");
        setMessages([]);
        toast.error("Không thể tải tin nhắn");
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);

      if (err.response?.status === 403) {
        toast.error("Bạn không có quyền xem tin nhắn này");
      } else if (err.response?.status === 404) {
        toast.error("Không tìm thấy cuộc trò chuyện");
      } else {
        toast.error("Lỗi khi tải tin nhắn");
      }

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    if (!checkAdminPermission()) {
      toast.error("Bạn không có quyền xem tin nhắn");
      return;
    }

    try {
      console.log("Conversation clicked:", conversation);
      setSelectedConversation(conversation);
      setMessagePage(1);
      fetchMessagesForConversation(conversation._id);
    } catch (error) {
      console.error("Error handling conversation click:", error);
      toast.error("Có lỗi xảy ra khi tải tin nhắn");
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setMessages([]);
    setEditingMessage(null);
    setEditText("");
  };

  const getProfileImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return defaultAvatar;

    if (imagePath.startsWith("/images/")) {
      return `${serverPublic.replace("/images/", "")}${imagePath}`;
    }

    return `${serverPublic}${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return `Today, ${format(date, "HH:mm", { locale: vi })}`;
      } else if (diffDays === 2) {
        return `Yesterday, ${format(date, "HH:mm", { locale: vi })}`;
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago, ${format(date, "HH:mm", {
          locale: vi,
        })}`;
      } else {
        return format(date, "dd/MM/yyyy, HH:mm", { locale: vi });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        setDeletingMessageId(messageId);
        setIsDeleting(true);

        await deleteMessage(messageId, selectedConversation?._id || "", true);

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
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message. Please try again.");
      } finally {
        setIsDeleting(false);
        setDeletingMessageId(null);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleMessagePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= messagePagination.totalPages) {
      setMessagePage(newPage);
      if (selectedConversation) {
        fetchMessagesForConversation(selectedConversation._id);
      }
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.name || "Group Chat";
    } else if (
      conversation.memberDetails &&
      conversation.memberDetails.length >= 2
    ) {
      return conversation.memberDetails
        .map((member) => member.fullname)
        .join(", ");
    } else {
      return "Private Chat";
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.senderId.fullname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      message.text.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleEdit = (message: MessageWithPopulated) => {
    setEditingMessage(message);
    setEditText(message.text);
  };

  const handleUpdate = async () => {
    if (!editingMessage) return;

    try {
      setIsUpdating(true);
      const response = await updateMessageAsAdmin(editingMessage._id, {
        text: editText,
        markAsEdited: true,
      });

      if (response.data) {
        setMessages(
          messages.map((msg) =>
            msg._id === editingMessage._id
              ? { ...msg, text: editText, isEdited: true }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Failed to update message. Please try again.");
    } finally {
      setIsUpdating(false);
      setEditingMessage(null);
      setEditText("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <h2 className="text-xl font-semibold">
          {selectedConversation ? "Conversation Details" : "Conversation List"}
        </h2>
        {selectedConversation && (
          <button
            onClick={handleBackToList}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to List
          </button>
        )}
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
              placeholder={
                selectedConversation
                  ? "Search messages..."
                  : "Search conversations..."
              }
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {!selectedConversation ? (
          loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {conversation.isGroup ? (
                          <div className="flex -space-x-2 mr-3">
                            {conversation.memberDetails
                              ?.slice(0, 3)
                              .map((member, index) => (
                                <img
                                  key={index}
                                  src={getProfileImageUrl(member.profilePic)}
                                  alt={member.fullname}
                                  className="w-9 h-9 rounded-full border-2 border-white"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = defaultAvatar;
                                  }}
                                />
                              ))}
                          </div>
                        ) : (
                          <img
                            src={getProfileImageUrl(
                              conversation.memberDetails?.[0]?.profilePic
                            )}
                            alt={conversation.memberDetails?.[0]?.fullname}
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = defaultAvatar;
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {getConversationName(conversation)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(conversation.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {conversation.lastMessage && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                        {typeof conversation.lastMessage === "object"
                          ? conversation.lastMessage.text ||
                            "No message content"
                          : conversation.lastMessage}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No conversations found.
                </div>
              )}

              {/* Pagination for conversations */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <button
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 mx-1">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-lg">
                {getConversationName(selectedConversation)}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.isGroup ? "Group Chat" : "Private Chat"} ·
                Created {formatDate(selectedConversation.createdAt)}
              </p>
              {selectedConversation.memberDetails && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Members:</p>
                  <div className="flex flex-wrap mt-1 gap-2">
                    {selectedConversation.memberDetails.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm"
                      >
                        <img
                          src={getProfileImageUrl(member.profilePic)}
                          alt={member.fullname}
                          className="w-6 h-6 rounded-full mr-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultAvatar;
                          }}
                        />
                        <span className="text-sm">{member.fullname}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h3 className="font-medium text-lg mb-3">Messages</h3>

            {loadingMessages ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div
                      key={message._id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={getProfileImageUrl(
                              message.senderId.profilePic
                            )}
                            alt={message.senderId.fullname}
                            className="w-10 h-10 rounded-full mr-2 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = defaultAvatar;
                            }}
                          />
                          <div>
                            <div className="font-medium">
                              {message.senderId.fullname}
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            message.isDeleted
                              ? "bg-red-100 text-red-800"
                              : message.isEdited
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {message.isDeleted
                            ? "Deleted"
                            : message.isEdited
                            ? "Edited"
                            : "Normal"}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-700">{message.text}</p>
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Attachments:
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {message.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href={`${serverPublic}${attachment}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-sm"
                                >
                                  Attachment {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      {editingMessage && editingMessage._id === message._id ? (
                        <div className="mt-3">
                          <textarea
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            aria-label="Edit message text"
                            placeholder="Edit message..."
                          />
                          <div className="flex justify-end mt-2 space-x-2">
                            <button
                              className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                              onClick={() => {
                                setEditingMessage(null);
                                setEditText("");
                              }}
                              disabled={isUpdating}
                            >
                              <X size={16} className="inline mr-1" />
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
                              onClick={handleUpdate}
                              disabled={!editText.trim() || isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2
                                    size={16}
                                    className="inline mr-1 animate-spin"
                                  />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Send size={16} className="inline mr-1" />
                                  Save
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end mt-2 space-x-2">
                          {!message.isDeleted && (
                            <button
                              className="text-red-600 hover:underline hover:bg-red-50 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDeleteMessage(message._id)}
                              disabled={
                                isDeleting && deletingMessageId === message._id
                              }
                            >
                              {isDeleting &&
                              deletingMessageId === message._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </button>
                          )}
                          {!message.isDeleted && (
                            <button
                              className="text-blue-600 hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                              onClick={() => handleEdit(message)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No messages found in this conversation.
                  </div>
                )}

                {/* Pagination for messages */}
                {messagePagination.totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                      onClick={() => handleMessagePageChange(messagePage - 1)}
                      disabled={!messagePagination.hasPrevPage}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 mx-1">
                      Page {messagePagination.currentPage} of{" "}
                      {messagePagination.totalPages}
                    </span>
                    <button
                      className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                      onClick={() => handleMessagePageChange(messagePage + 1)}
                      disabled={!messagePagination.hasNextPage}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
