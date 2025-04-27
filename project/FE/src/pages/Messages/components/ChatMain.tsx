import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import ChatDetail from "./ChatDetail";
import { getUser } from "@/api/UserRequest";
import { getMessages, addMessage } from "@/api/MessageRequest";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { getConversationById } from "@/api/ConversationRequest";

// Server public path for images
const SERVER_PUBLIC = "http://localhost:3000/images/";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  senderProfilePic?: string;
}

// Define proper types for ChatDetail props
interface Member {
  name: string;
  isAdmin: boolean;
  proPic?: string;
}

interface FileData {
  name: string;
  size: string;
}

interface ChatMainProps {
  chat: any;
  currentUser: string;
  setSendMessage?: Dispatch<SetStateAction<any>>;
  receivedMessage?: any;
}

const ChatMain = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
}: ChatMainProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [conversationDetail, setConversationDetail] = useState<any>(null);

  // Refs
  const scroll = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // UI states
  const [isHovered, setIsHovered] = useState({
    addMember: false,
    chatMessage: false,
  });
  const [selectedTab, setSelectedTab] = useState<"image" | "file">("image");
  const [isChatDetailVisible, setIsChatDetailVisible] = useState(true);

  // Lấy thông tin người dùng hiện tại từ Redux store
  const { user } = useSelector((state: any) => state.authReducer.authData);

  // Tạo đường dẫn đầy đủ đến ảnh đại diện của người dùng hiện tại
  const currentUserProfilePic = user?.profilePic || undefined;

  // Lấy thông tin đầy đủ về cuộc trò chuyện
  useEffect(() => {
    if (!chat?._id) return;

    const fetchConversationDetail = async () => {
      try {
        setIsLoading(true);
        console.log("Đang lấy thông tin cuộc trò chuyện chi tiết:", chat._id);
        const { data } = await getConversationById(chat._id);
        console.log("Thông tin cuộc trò chuyện chi tiết:", data);

        // Lưu thông tin chi tiết cuộc trò chuyện
        const conversationData = data.conversation || data;
        setConversationDetail(conversationData);

        // Nếu là nhóm chat, cập nhật thông tin nhóm
        if (conversationData.isGroupChat) {
          console.log("Đây là nhóm chat, cập nhật thông tin nhóm");

          // Chuẩn bị danh sách thành viên nhóm
          const groupMembers: Member[] = [];

          // Thêm người dùng hiện tại
          groupMembers.push({
            name: "Bạn",
            isAdmin: currentUser === conversationData.groupAdmin,
            proPic: currentUserProfilePic,
          });

          // Thêm các thành viên khác
          if (Array.isArray(conversationData.members)) {
            const memberPromises = conversationData.members
              .filter((member: any) => {
                // Chỉ lấy thông tin của các thành viên khác
                if (typeof member === "object" && member._id) {
                  return member._id !== currentUser;
                }
                return member !== currentUser;
              })
              .map(async (member: any) => {
                const memberId =
                  typeof member === "object" ? member._id : member;
                if (!memberId) return null;

                try {
                  const { data } = await getUser(memberId);
                  return {
                    name: data.fullname || data.username || "Thành viên nhóm",
                    isAdmin: memberId === conversationData.groupAdmin,
                    proPic: data.profilePic || undefined,
                    _id: memberId,
                  };
                } catch (error) {
                  console.error(
                    `Lỗi khi lấy thông tin thành viên ${memberId}:`,
                    error
                  );
                  return {
                    name: "Thành viên nhóm",
                    isAdmin: memberId === conversationData.groupAdmin,
                    proPic: undefined,
                    _id: memberId,
                  };
                }
              });

            // Chờ tất cả các promise hoàn thành
            const memberDetails = await Promise.all(memberPromises);
            // Lọc bỏ các kết quả null và thêm vào danh sách thành viên
            const validMembers = memberDetails.filter((m) => m !== null);
            setMembers([...groupMembers, ...validMembers]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cuộc trò chuyện:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationDetail();
  }, [chat?._id, currentUser, currentUserProfilePic]);

  // Fetch user data for header (direct messaging - other user)
  useEffect(() => {
    if (!chat || !currentUser) {
      console.log("Không có chat hoặc currentUser:", { chat, currentUser });
      return;
    }

    console.log("Đang tải dữ liệu chat:", chat);
    console.log("Thông tin người dùng hiện tại:", user);
    setIsLoading(true);

    // For direct messages, find the other user's ID
    let userId: string | undefined;
    let otherUsers = [];

    // Kiểm tra cấu trúc của members
    if (Array.isArray(chat.members)) {
      // Lọc ra các thành viên khác người dùng hiện tại
      otherUsers = chat.members.filter((member: any) => {
        // Xử lý member có thể là object hoặc string
        if (typeof member === "object" && member !== null) {
          return member._id !== currentUser;
        }
        return member !== currentUser;
      });

      // Lấy ID người dùng đầu tiên
      if (otherUsers.length > 0) {
        const firstUser = otherUsers[0];
        userId = typeof firstUser === "object" ? firstUser._id : firstUser;
      }
    }

    console.log("UserId được tìm thấy:", userId);
    console.log("Tổng số thành viên:", chat.members ? chat.members.length : 0);

    const getUserData = async () => {
      try {
        console.log("Đang lấy thông tin người dùng cho ID:", userId);

        // Kiểm tra userId có tồn tại không
        if (!userId) {
          console.error(
            "userId không hợp lệ, không thể lấy thông tin người dùng"
          );
          setIsLoading(false);
          return;
        }

        const { data } = await getUser(userId);
        console.log("Dữ liệu người dùng nhận được:", data);
        setUserData(data);

        // Create member list for direct messaging
        const membersList: Member[] = [];

        // Thêm người dùng khác
        if (data) {
          membersList.push({
            name: data.fullname || data.username,
            isAdmin: false,
            proPic: data.profilePic || undefined,
          });
        }

        // Thêm người dùng hiện tại
        membersList.push({
          name: "Bạn",
          isAdmin: true,
          proPic: currentUserProfilePic, // Sử dụng ảnh từ Redux store
        });

        // Nếu là nhóm chat, thêm các thành viên khác
        if (chat.isGroupChat && Array.isArray(chat.members)) {
          chat.members.forEach((member: any) => {
            if (member._id !== currentUser && member._id !== userId) {
              membersList.push({
                name: member.fullname || member.username || "Thành viên",
                isAdmin: member.isAdmin || false,
                proPic: member.profilePic || undefined,
              });
            }
          });
        }

        console.log("Danh sách thành viên được cập nhật:", membersList);
        setMembers(membersList);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!chat.isGroupChat) {
      getUserData();
    } else {
      // Xử lý thông tin nhóm chat
      console.log("Đây là nhóm chat, cập nhật thông tin nhóm:", chat.chatName);

      // Sử dụng thông tin từ conversationDetail nếu có
      const groupInfo = conversationDetail || chat;
      console.log("Thông tin admin nhóm:", groupInfo.groupAdmin);

      // Group chat handling
      if (Array.isArray(groupInfo.members)) {
        // Reset the group members array first
        const uniqueMembers = new Set();

        // Add current user to the set
        uniqueMembers.add(currentUser);

        // Add other members
        groupInfo.members.forEach((member: any) => {
          if (typeof member === "object" && member._id) {
            uniqueMembers.add(member._id);
          } else if (typeof member === "string") {
            uniqueMembers.add(member);
          }
        });

        console.log("Số thành viên thực tế:", uniqueMembers.size);

        // Clear and rebuild the members list
        const groupMembers: Member[] = [];

        // Add current user
        groupMembers.push({
          name: "Bạn",
          isAdmin: currentUser === groupInfo.groupAdmin,
          proPic: currentUserProfilePic,
        });

        // Add other members with full information when available
        if (Array.isArray(groupInfo.members)) {
          const fetchMemberDetails = async () => {
            const memberPromises = groupInfo.members
              .filter((member: any) => {
                // Chỉ lấy thông tin của các thành viên khác
                if (typeof member === "object" && member._id) {
                  return member._id !== currentUser;
                }
                return member !== currentUser;
              })
              .map(async (member: any) => {
                const memberId =
                  typeof member === "object" ? member._id : member;
                if (!memberId) return null;

                try {
                  const { data } = await getUser(memberId);
                  return {
                    name: data.fullname || data.username || "Thành viên nhóm",
                    isAdmin: memberId === groupInfo.groupAdmin,
                    proPic: data.profilePic || undefined,
                    _id: memberId,
                  };
                } catch (error) {
                  console.error(
                    `Lỗi khi lấy thông tin thành viên ${memberId}:`,
                    error
                  );
                  return {
                    name: "Thành viên nhóm",
                    isAdmin: memberId === groupInfo.groupAdmin,
                    proPic: undefined,
                    _id: memberId,
                  };
                }
              });

            // Chờ tất cả các promise hoàn thành
            const memberDetails = await Promise.all(memberPromises);
            // Lọc bỏ các kết quả null và thêm vào danh sách thành viên
            const validMembers = memberDetails.filter((m) => m !== null);
            setMembers([...groupMembers, ...validMembers]);
            setIsLoading(false);
          };

          fetchMemberDetails();
        } else {
          console.log("Không có thông tin members hợp lệ");
          setMembers(groupMembers);
          setIsLoading(false);
        }
      } else {
        console.log("Không tìm thấy danh sách thành viên");
        setIsLoading(false);
      }
    }
  }, [chat, currentUser, conversationDetail]);

  // Fetch messages
  useEffect(() => {
    if (!chat?._id) {
      console.log("Không có chat._id để tải tin nhắn");
      return;
    }

    console.log("Đang tải tin nhắn cho chat ID:", chat._id);
    setIsLoading(true);
    const fetchMessages = async () => {
      try {
        const response = await getMessages(chat._id);
        console.log("Response từ API tin nhắn:", response);

        // Xử lý cấu trúc API mới với pagination và messages
        let messageData = response.data;

        // Kiểm tra xem dữ liệu có nằm trong thuộc tính messages không
        if (response.data && response.data.messages) {
          messageData = response.data.messages;
        }

        console.log("Tin nhắn nhận được:", messageData);

        if (!messageData || messageData.length === 0) {
          console.log("Không có tin nhắn nào");
          setMessages([]);
          setIsLoading(false);
          return;
        }

        // Get unique sender IDs to fetch user data
        const senderIds = [
          ...new Set(
            messageData.map((msg: any) =>
              typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId
            )
          ),
        ].filter((id): id is string => typeof id === "string");

        console.log("Danh sách senderIds cần lấy thông tin:", senderIds);

        // Fetch user data for all senders
        const senderDataMap = new Map();

        // Thêm current user vào map
        senderDataMap.set(currentUser, {
          fullname: "You",
          profilePic: currentUserProfilePic,
        });

        // Fetch data for other senders
        for (const senderId of senderIds) {
          if (senderId !== currentUser) {
            try {
              const { data } = await getUser(senderId);
              senderDataMap.set(senderId, {
                fullname: data.fullname || data.username || "User",
                profilePic: data.profilePic,
              });
              console.log(
                `Đã lấy thông tin sender ${senderId}:`,
                data.fullname,
                data.profilePic
              );
            } catch (error) {
              console.error(`Lỗi khi lấy thông tin sender ${senderId}:`, error);
              senderDataMap.set(senderId, {
                fullname: "User",
                profilePic: undefined,
              });
            }
          }
        }

        // Transform API messages to match our Message interface
        const formattedMessages = messageData.map((msg: any) => {
          // Xử lý senderId có thể là object hoặc string
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

          // Lấy thông tin sender từ map
          const senderData = senderDataMap.get(senderId);
          const senderName =
            senderId === currentUser ? "You" : senderData?.fullname || "User";

          return {
            id: msg._id,
            sender: senderName,
            content: msg.text,
            timestamp: format(msg.createdAt), // Using timeago.js for formatting
            senderId: senderId,
            chatId: msg.conversationId,
            createdAt: msg.createdAt,
            // Thêm trường mới cho file đính kèm nếu có
            attachments: msg.attachments || [],
            senderProfilePic: senderData?.profilePic,
          };
        });

        console.log("Tin nhắn đã định dạng với ảnh:", formattedMessages);
        setMessages(formattedMessages);

        // Extract file data if available
        const fileData = messageData
          .filter((msg: any) => msg.attachments && msg.attachments.length > 0)
          .map((msg: any) => {
            const attachment = msg.attachments[0];
            return {
              name: attachment.fileName || "File đính kèm",
              size: attachment.fileSize
                ? `${Math.round(attachment.fileSize / 1024)}KB`
                : "~KB",
            };
          });

        if (fileData.length > 0) {
          console.log("Dữ liệu file được tìm thấy:", fileData);
          setFiles(fileData);
        }
      } catch (error) {
        console.log("Lỗi khi tải tin nhắn:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chat, userData, currentUser]);

  // Handle received message from socket
  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === chat?._id) {
      console.log("Đã nhận tin nhắn mới từ socket:", receivedMessage);

      const fetchSenderInfo = async () => {
        // If the message is from the current user, use current user data
        if (receivedMessage.senderId === currentUser) {
          const newMsg: Message = {
            id: receivedMessage._id || Date.now().toString(),
            sender: "You",
            content:
              typeof receivedMessage.text === "object"
                ? receivedMessage.text.text || "Tin nhắn mới"
                : receivedMessage.text || "Tin nhắn mới",
            timestamp: format(receivedMessage.createdAt || new Date()),
            senderId: receivedMessage.senderId,
            chatId: receivedMessage.chatId,
            createdAt: receivedMessage.createdAt || new Date().toISOString(),
            senderProfilePic: currentUserProfilePic,
          };

          console.log(
            "Tin nhắn của bạn đã được định dạng để hiển thị:",
            newMsg
          );
          setMessages((prev) => [...prev, newMsg]);
          return;
        }

        // If the message is from another user, fetch their data
        try {
          const { data } = await getUser(receivedMessage.senderId);
          console.log("Đã lấy thông tin người gửi:", data);

          const newMsg: Message = {
            id: receivedMessage._id || Date.now().toString(),
            sender: data.fullname || data.username || "User",
            content:
              typeof receivedMessage.text === "object"
                ? receivedMessage.text.text || "Tin nhắn mới"
                : receivedMessage.text || "Tin nhắn mới",
            timestamp: format(receivedMessage.createdAt || new Date()),
            senderId: receivedMessage.senderId,
            chatId: receivedMessage.chatId,
            createdAt: receivedMessage.createdAt || new Date().toISOString(),
            senderProfilePic: data.profilePic,
          };

          console.log(
            "Tin nhắn đã được định dạng để hiển thị với ảnh:",
            newMsg
          );
          setMessages((prev) => [...prev, newMsg]);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người gửi:", error);

          // Fall back to using userData if available, or default values
          const newMsg: Message = {
            id: receivedMessage._id || Date.now().toString(),
            sender: userData?.fullname || "User",
            content:
              typeof receivedMessage.text === "object"
                ? receivedMessage.text.text || "Tin nhắn mới"
                : receivedMessage.text || "Tin nhắn mới",
            timestamp: format(receivedMessage.createdAt || new Date()),
            senderId: receivedMessage.senderId,
            chatId: receivedMessage.chatId,
            createdAt: receivedMessage.createdAt || new Date().toISOString(),
            senderProfilePic: userData?.profilePic,
          };

          console.log("Tin nhắn đã được định dạng (dùng fallback):", newMsg);
          setMessages((prev) => [...prev, newMsg]);
        }
      };

      fetchSenderInfo();
    }
  }, [receivedMessage, chat, userData, currentUser, currentUserProfilePic]);

  // Always scroll to last Message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSend = () => {
    if (!message.trim() || !chat?._id) {
      console.log("Không thể gửi tin nhắn trống hoặc không có chat ID");
      return;
    }

    const now = new Date();
    console.log("Đang gửi tin nhắn:", message);
    console.log("Chat ID:", chat._id);
    console.log("Current User:", currentUser);

    // Create temporary message for UI display
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: message,
      timestamp: format(now),
      senderId: currentUser,
      chatId: chat._id,
      createdAt: now.toISOString(),
      senderProfilePic: currentUserProfilePic,
    };

    // Update UI immediately
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    // Prepare message data for socket and API
    const messageData = {
      senderId: currentUser,
      text: message,
      chatId: chat._id,
      conversationId: chat._id, // Thêm trường này để phù hợp với API mới
      receiverId: chat.members.find((id: string) => id !== currentUser),
    };

    console.log("Dữ liệu tin nhắn gửi đi:", messageData);

    // Send to socket server if available
    if (setSendMessage) {
      setSendMessage(messageData);
      console.log("Đã gửi tin nhắn qua socket");
    }

    // Send to API
    addMessage(messageData)
      .then((response) => {
        console.log("Tin nhắn đã lưu vào DB:", response.data);

        // Cập nhật tin nhắn trong state với ID từ server
        if (response.data && response.data._id) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === newMsg.id ? { ...msg, id: response.data._id } : msg
            )
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gửi tin nhắn:", error);
        console.error("Chi tiết lỗi:", error.response || error.message);

        // Hiển thị thông báo lỗi
        alert("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
      });

    setMessage("");
  };

  return (
    <div className="flex h-full w-full">
      <div
        className={`${
          isChatDetailVisible ? "w-[70%]" : "w-full"
        } h-full flex flex-col`}
      >
        <ChatHeader
          chatName={
            chat?.isGroupChat
              ? chat?.chatName || chat?.groupName || "Nhóm chat"
              : userData?.fullname || userData?.username || "Cuộc trò chuyện"
          }
          isGroup={chat?.isGroupChat}
          avatar={
            chat?.isGroupChat
              ? chat?.groupPhoto || undefined
              : userData?.profilePic || undefined
          }
          members={members}
          toggleChatDetail={() => setIsChatDetailVisible((prev) => !prev)}
        />

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 w-full custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showSenderInfo =
                index === 0 ||
                (prevMessage &&
                  msg.createdAt &&
                  prevMessage.createdAt &&
                  new Date(msg.createdAt).getTime() -
                    new Date(prevMessage.createdAt).getTime() >
                    60000) ||
                msg.sender !== prevMessage?.sender;

              const isSentByMe = msg.sender === "You";

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isSentByMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {showSenderInfo && !isSentByMe && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mr-2"
                      aria-label={`${msg.sender}'s avatar`}
                    >
                      {msg.senderProfilePic ? (
                        <img
                          src={
                            msg.senderProfilePic.startsWith("http")
                              ? msg.senderProfilePic
                              : `${SERVER_PUBLIC}${msg.senderProfilePic}`
                          }
                          alt={`${msg.sender}'s avatar`}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.classList.add("bg-pink-500");
                              parent.textContent = msg.sender[0] || "U";
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-pink-500 flex items-center justify-center">
                          {msg.sender[0] || "U"}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {showSenderInfo && (
                      <h2
                        className={`text-sm font-medium ${
                          isSentByMe ? "text-right mr-2" : "text-left ml-2"
                        }`}
                      >
                        {isSentByMe ? "Bạn" : msg.sender}
                      </h2>
                    )}
                    <MessageBubble
                      message={msg}
                      className={`${
                        !isSentByMe && !showSenderInfo ? "ml-10" : ""
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
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
              <p className="text-gray-500 text-center">No messages yet</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t">
          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            className=""
          />
        </div>
      </div>
      {/* Chat Detail */}
      {isChatDetailVisible && (
        <div className="w-[30%] h-full">
          <ChatDetail
            isOpen={isChatDetailVisible}
            onClose={() => setIsChatDetailVisible(false)}
            chat={chat || conversationDetail}
            members={members}
            currentUser={currentUser}
            groupAdmin={conversationDetail?.groupAdmin}
            files={files}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMain;
