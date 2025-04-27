import { useState, useRef, useEffect } from "react";
import { ChatMain, Conversation } from "./components";
import Sidebar from "@/components/layout/Sidebar";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  getAllConversations,
  findConversation,
  createConversation,
} from "@/api/ConversationRequest";
import { useSearchParams, useNavigate } from "react-router-dom";
import searchIcon from "@assets/images/icon-search.png";

function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const socket = useRef<any>(null);
  const { user } = useSelector((state: any) => state.authReducer.authData);

  const [chats, setChats] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "direct" | "group">(
    "all"
  );
  const [searchText, setSearchText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  console.log("Current chat:", currentChat);

  // Lưu currentChat vào localStorage khi thay đổi
  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("currentChatId", currentChat._id);
    }
  }, [currentChat]);

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      setIsLoading(true);
      try {
        const response = await getAllConversations(user._id);
        const { data } = response;

        // Kiểm tra nếu dữ liệu có cấu trúc mới (có conversations và pagination)
        if (data && data.conversations) {
          setChats(data.conversations);

          // Khôi phục chat đã chọn trước đó (sau khi danh sách chat đã được tải)
          const savedChatId = localStorage.getItem("currentChatId");
          if (savedChatId) {
            const savedChat = data.conversations.find(
              (chat: any) => chat._id === savedChatId
            );
            if (savedChat) {
              console.log("Khôi phục cuộc trò chuyện đã lưu:", savedChat);
              setCurrentChat(savedChat);
            }
          }
        } else if (Array.isArray(data)) {
          // Xử lý trường hợp API trả về mảng trực tiếp (tương thích ngược)
          setChats(data);

          // Khôi phục chat đã chọn trước đó (sau khi danh sách chat đã được tải)
          const savedChatId = localStorage.getItem("currentChatId");
          if (savedChatId) {
            const savedChat = data.find(
              (chat: any) => chat._id === savedChatId
            );
            if (savedChat) {
              console.log("Khôi phục cuộc trò chuyện đã lưu:", savedChat);
              setCurrentChat(savedChat);
            }
          }
        } else {
          console.error("Định dạng dữ liệu không hợp lệ:", data);
          setChats([]);
        }
      } catch (error) {
        console.log("Lỗi khi lấy cuộc trò chuyện:", error);
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      getChats();
    }
  }, [user?._id]);

  // Handle opening chat with specific user from URL
  useEffect(() => {
    const openChatWithUser = async () => {
      if (!targetUserId || !user?._id || targetUserId === user._id) return;

      try {
        // First check if conversation already exists
        const { data } = await findConversation(user._id, targetUserId);

        if (data) {
          // Conversation exists, set it as current chat
          setCurrentChat(data);
        } else {
          // Create new conversation
          const newConversation = {
            senderId: user._id,
            receiverId: targetUserId,
          };

          const result = await createConversation(newConversation);
          if (result.data) {
            setCurrentChat(result.data);
            // Update chats list
            setChats((prev) => [result.data, ...prev]);
          }
        }

        // Remove the userId parameter from URL to prevent reopening on refresh
        navigate("/message", { replace: true });
      } catch (error) {
        console.error("Error opening chat with user:", error);
      }
    };

    if (targetUserId && user?._id && chats.length > 0) {
      openChatWithUser();
    }
  }, [targetUserId, user?._id, chats, navigate]);

  // Connect to Socket.io
  useEffect(() => {
    if (!user?._id) return;

    try {
      // Clear previous socket if exists
      if (socket.current) {
        socket.current.disconnect();
      }

      setSocketError(null);

      // Thêm timeout dài hơn và thử lại kết nối
      socket.current = io("http://localhost:8800", {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 20000, // Tăng timeout lên 20 giây
        transports: ["websocket", "polling"], // Thêm polling để fallback
      });

      // Handle connection events
      socket.current.on("connect", () => {
        console.log("Socket kết nối thành công");
        setSocketConnected(true);
        socket.current.emit("new-user-add", user._id);
      });

      socket.current.on("connect_error", (err: any) => {
        console.error("Lỗi kết nối socket:", err);
        setSocketError(
          "Không thể kết nối đến máy chủ chat. Vui lòng thử lại sau."
        );
        setSocketConnected(false);
      });

      socket.current.on("error", (err: any) => {
        console.error("Lỗi socket:", err);
      });

      socket.current.on("get-users", (users: any) => {
        setOnlineUsers(users);
      });

      // Clean up on unmount
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    } catch (error) {
      console.error("Lỗi khởi tạo socket:", error);
      setSocketError(
        "Không thể khởi tạo kết nối chat. Vui lòng làm mới trang."
      );
      setSocketConnected(false);
    }
  }, [user?._id]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null && socket.current && socketConnected) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage, socketConnected]);

  // Get the message from socket server
  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-message", (data: any) => {
        console.log("Received message:", data);
        setReceivedMessage(data);

        // Cập nhật tin nhắn mới nhất và sắp xếp lại danh sách cuộc trò chuyện
        setChats((prevChats) => {
          // Tìm cuộc trò chuyện cần cập nhật
          const updatedChats = prevChats.map((chat) => {
            if (chat._id === data.chatId) {
              // Cập nhật tin nhắn mới nhất
              return {
                ...chat,
                lastMessage: {
                  text:
                    typeof data.text === "object" ? data.text.text : data.text,
                  senderId: data.senderId,
                  createdAt: data.createdAt || new Date().toISOString(),
                },
              };
            }
            return chat;
          });

          // Sắp xếp lại với cuộc trò chuyện có tin nhắn mới nhất lên đầu
          return [...updatedChats].sort((a, b) => {
            const timeA = a.lastMessage?.createdAt
              ? new Date(a.lastMessage.createdAt).getTime()
              : 0;
            const timeB = b.lastMessage?.createdAt
              ? new Date(b.lastMessage.createdAt).getTime()
              : 0;
            return timeB - timeA;
          });
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("receive-message");
      }
    };
  }, [socket.current, currentChat]);

  const checkOnlineStatus = (chat: any) => {
    const chatMember = chat.members.find((member: any) => member !== user._id);
    const online = onlineUsers.find((user: any) => user.userId === chatMember);
    return online ? true : false;
  };

  // Xử lý click vào cuộc trò chuyện
  const handleChatClick = (chat: any) => {
    console.log("Chat clicked:", chat);
    setCurrentChat(chat);
    localStorage.setItem("currentChatId", chat._id);
  };

  // Lọc cuộc trò chuyện theo tab và tìm kiếm
  const filteredChats = chats.filter((chat) => {
    // Lọc theo tab
    const tabMatch =
      selectedTab === "all"
        ? true
        : selectedTab === "direct"
        ? !chat.isGroupChat
        : chat.isGroupChat;

    // Lọc theo tìm kiếm
    if (!searchText) return tabMatch;

    // Tìm kiếm trong tên nhóm nếu là nhóm
    if (chat.isGroupChat && chat.groupName) {
      return (
        chat.groupName.toLowerCase().includes(searchText.toLowerCase()) &&
        tabMatch
      );
    }

    // Không có thông tin để tìm kiếm
    return tabMatch;
  });

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="fixed flex ml-20 w-[calc(100%-80px)] h-[100vh]">
        {/* Danh sách cuộc trò chuyện */}
        <div className="w-1/4 border-r flex flex-col h-full">
          <div className="font-bold text-zinc-900 text-2xl tracking-tight py-3 px-4 border-b">
            Tin nhắn
          </div>

          {socketError && (
            <div className="p-2 text-sm text-red-500 bg-red-50">
              {socketError}
            </div>
          )}

          {/* Thanh tìm kiếm */}
          <div className="px-2 pt-2">
            <div
              className={`flex overflow-hidden items-center w-full h-10 px-3 leading-none rounded-xl border border-solid bg-zinc-100 transition-all duration-300 ${
                isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
              } text-zinc-900 max-md:px-5 max-md:max-w-full`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={searchIcon}
                className={`object-contain shrink-0 w-[16px] mr-1 transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`}
                alt="Search icon"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="flex-grow bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Chat filter tabs */}
          <div className="flex mt-2 border-b bg-[#F0F0F0] h-12  rounded-t-[20px] rounded-b-[20px]  mx-2">
            <button
              className={`flex-1 h-full text-sm transition-all duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
                selectedTab === "all"
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
                  : "bg-transparent text-[#1CA7EC]"
              }`}
              onClick={() => setSelectedTab("all")}
            >
              All
            </button>
            <button
              className={`flex-1 h-full text-sm transition-all duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
                selectedTab === "direct"
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
                  : "bg-transparent text-[#1CA7EC]"
              }`}
              onClick={() => setSelectedTab("direct")}
            >
              Direct
            </button>
            <button
              className={`flex-1 h-full text-sm transition-all duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
                selectedTab === "group"
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
                  : "bg-transparent text-[#1CA7EC]"
              }`}
              onClick={() => setSelectedTab("group")}
            >
              Group
            </button>
          </div>

          {/* Khung cuộn cho danh sách chat */}
          <div className="flex-1 overflow-y-auto pb-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className="cursor-pointer"
                >
                  <Conversation
                    data={chat}
                    currentUser={user._id}
                    online={checkOnlineStatus(chat)}
                    onSelectChat={(chatData) => {
                      console.log(
                        "Callback onSelectChat được gọi với:",
                        chatData
                      );
                      handleChatClick(chat);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found. Start a new chat!
              </div>
            )}
          </div>
        </div>

        {/* Phần chat chính */}
        <div className="flex-1 h-full overflow-hidden">
          {currentChat ? (
            <ChatMain
              chat={currentChat}
              currentUser={user._id}
              setSendMessage={setSendMessage}
              receivedMessage={receivedMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-xl mb-2">
                No conversation selected
              </p>
              <p className="text-gray-400 text-center max-w-md">
                Choose a conversation from the left list or create a new one to
                start
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
