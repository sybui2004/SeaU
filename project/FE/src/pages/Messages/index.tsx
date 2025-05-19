import { useState, useRef, useEffect } from "react";
import { ChatMain, Conversation } from "./components";
import Sidebar from "@/components/layout/Sidebar";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  getUserConversations,
  findConversation,
  createConversation,
  createGroupChat,
} from "@/api/ConversationRequest";
import { getFriendsList } from "@/api/UserRequest";
import { useSearchParams, useNavigate } from "react-router-dom";
import searchIcon from "@assets/images/icon-search.png";
import { Button } from "@/components/ui/button";
import { User, X, Users } from "lucide-react";

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

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
  const [availableFriends, setAvailableFriends] = useState<any[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");

  console.log("Current chat:", currentChat);

  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("currentChatId", currentChat._id);
    }
  }, [currentChat]);

  useEffect(() => {
    const getChats = async () => {
      setIsLoading(true);
      try {
        const response = await getUserConversations(user._id);
        const { data } = response;

        if (data && data.conversations) {
          setChats(data.conversations);
          const savedChatId = localStorage.getItem("currentChatId");
          if (savedChatId) {
            const savedChat = data.conversations.find(
              (chat: any) => chat._id === savedChatId
            );
            if (savedChat) {
              setCurrentChat(savedChat);
            }
          }
        } else if (Array.isArray(data)) {
          setChats(data);

          const savedChatId = localStorage.getItem("currentChatId");
          if (savedChatId) {
            const savedChat = data.find(
              (chat: any) => chat._id === savedChatId
            );
            if (savedChat) {
              setCurrentChat(savedChat);
            }
          }
        } else {
          setChats([]);
        }
      } catch (error) {
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      getChats();
    }
  }, [user?._id]);

  useEffect(() => {
    const openChatWithUser = async () => {
      if (!targetUserId || !user?._id || targetUserId === user._id) return;

      try {
        const { data } = await findConversation(user._id, targetUserId);

        if (data) {
          if (
            !data._id ||
            !data.members ||
            (Array.isArray(data.members) && data.members.length < 2)
          ) {
            return;
          }

          setCurrentChat(data);
        } else {
          const result = await createConversation(user._id, targetUserId);
          if (result.data && result.data._id) {
            if (
              !result.data.members ||
              (Array.isArray(result.data.members) &&
                result.data.members.length < 2)
            ) {
              return;
            }

            console.log("New conversation created:", result.data);
            setCurrentChat(result.data);

            setChats((prev) => [result.data, ...prev]);
          } else {
            console.error(
              "Failed to create conversation, invalid data:",
              result
            );
          }
        }

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
      if (socket.current) {
        socket.current.disconnect();
      }

      setSocketError(null);

      socket.current = io("http://localhost:8800", {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 20000,
        transports: ["websocket", "polling"],
      });

      socket.current.on("connect", () => {
        setSocketConnected(true);
        socket.current.emit("new-user-add", user._id);
      });

      socket.current.on("connect_error", (err: any) => {
        console.error("Lỗi kết nối socket:", err);
        setSocketError(
          "Cannot connect to chat server. Please try again later."
        );
        setSocketConnected(false);
      });

      socket.current.on("error", (err: any) => {
        console.error("Lỗi socket:", err);
      });

      socket.current.on("get-users", (users: any) => {
        setOnlineUsers(users);
      });

      socket.current.on("receive-message", (data: any) => {
        console.log("Received message:", data);
        setReceivedMessage(data);

        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat._id === data.chatId) {
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

      socket.current.on("new-group-chat", (data: any) => {
        console.log("Nhận thông báo nhóm chat mới:", data);

        setChats((prevChats) => {
          const chatExists = prevChats.some(
            (chat) => chat._id === data.groupChat._id
          );
          if (chatExists) {
            return prevChats;
          }

          return [data.groupChat, ...prevChats];
        });
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          socket.current.off("receive-message");
          socket.current.off("new-group-chat");
        }
      };
    } catch (error) {
      console.error("Error:", error);
      setSocketError(
        "Cannot initialize chat connection. Please refresh the page."
      );
      setSocketConnected(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (sendMessage !== null && socket.current && socketConnected) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage, socketConnected]);

  const checkOnlineStatus = (chat: any) => {
    const chatMember = chat.members.find((member: any) => member !== user._id);
    const online = onlineUsers.find((user: any) => user.userId === chatMember);
    return online ? true : false;
  };

  const handleChatClick = (chat: any) => {
    if (
      !chat._id ||
      !chat.members ||
      (Array.isArray(chat.members) && chat.members.length < 2)
    ) {
      console.error("Cannot open invalid conversation:", chat);
      return;
    }

    console.log("Chat clicked:", chat);
    setCurrentChat(chat);
    localStorage.setItem("currentChatId", chat._id);
  };

  const filteredChats = chats.filter((chat) => {
    if (
      !chat._id ||
      !chat.members ||
      (Array.isArray(chat.members) && chat.members.length < 2)
    ) {
      console.warn("Skipping invalid conversation:", chat);
      return false;
    }

    const tabMatch =
      selectedTab === "all"
        ? true
        : selectedTab === "direct"
        ? !chat.isGroupChat
        : chat.isGroupChat;

    if (!searchText) return tabMatch;

    if (chat.isGroupChat && chat.groupName) {
      return (
        chat.groupName.toLowerCase().includes(searchText.toLowerCase()) &&
        tabMatch
      );
    }

    return tabMatch;
  });

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;

      try {
        const response = await getFriendsList(user._id, 1, 100);
        if (response.data && response.data.friends) {
          setAvailableFriends(response.data.friends);
        }
      } catch (error) {
        console.error("Error fetching friends list:", error);
      }
    };

    if (showCreateGroup) {
      fetchFriends();
    }
  }, [user?._id, showCreateGroup]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedFriends.length < 2) {
      alert("Please enter a group name and select at least 2 friends");
      return;
    }

    setIsCreatingGroup(true);
    try {
      const memberIds = [
        user._id,
        ...selectedFriends.map((friend) => friend._id),
      ];

      const response = await createGroupChat(groupName, memberIds, user._id);

      if (response.data && response.data.groupChat) {
        setChats((prev) => [response.data.groupChat, ...prev]);

        setCurrentChat(response.data.groupChat);
        localStorage.setItem("currentChatId", response.data.groupChat._id);

        setGroupName("");
        setSelectedFriends([]);
        setShowCreateGroup(false);
        if (socket.current && socketConnected) {
          selectedFriends.forEach((friend) => {
            socket.current.emit("new-group-chat", {
              groupChat: response.data.groupChat,
              receiverId: friend._id,
              creatorId: user._id,
            });
          });
        }
      }
    } catch (error) {
      console.error("Error creating group chat:", error);
      alert("Cannot create group chat. Please try again later.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const toggleSelectFriend = (friend: any) => {
    if (selectedFriends.some((f) => f._id === friend._id)) {
      setSelectedFriends((prev) => prev.filter((f) => f._id !== friend._id));
    } else {
      setSelectedFriends((prev) => [...prev, friend]);
    }
  };

  const filteredFriends = availableFriends.filter((friend) =>
    friend.fullname.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="fixed flex ml-20 w-[calc(100%-80px)] h-[100vh]">
        <div className="w-1/4 border-r flex flex-col h-full">
          <div className="font-bold text-zinc-900 text-2xl tracking-tight py-3 px-4 border-b">
            Message
          </div>

          {socketError && (
            <div className="p-2 text-sm text-red-500 bg-red-50">
              {socketError}
            </div>
          )}

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

          <div className="px-2 pt-2">
            <Button
              onClick={() => setShowCreateGroup(true)}
              variant="gradientCustom"
              className="w-full text-white shadow-md transition-all duration-300"
            >
              <Users className="mr-2 h-4 w-4" /> Create group chat
            </Button>
          </div>

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

          <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
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

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-5 relative max-h-[80vh] flex flex-col">
            <button
              onClick={() => setShowCreateGroup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">
              Create group chat
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nhập tên nhóm..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected members ({selectedFriends.length})
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center bg-blue-100 px-2 py-1 rounded-full"
                  >
                    <span className="text-sm">{friend.fullname}</span>
                    <button
                      onClick={() => toggleSelectFriend(friend)}
                      className="ml-1 text-red-500 hover:text-red-700"
                      aria-label={`Xóa ${friend.fullname}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedFriends.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Select at least 2 friends to create a group
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select friends
              </label>
              <input
                type="text"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
            </div>

            <div className="overflow-y-auto flex-1 border border-gray-200 rounded-md">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-50 ${
                      selectedFriends.some((f) => f._id === friend._id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => toggleSelectFriend(friend)}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
                      {friend.profilePic ? (
                        <img
                          src={`${import.meta.env.VITE_PUBLIC_FOLDER}${
                            friend.profilePic
                          }`}
                          alt={friend.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{friend.fullname}</p>
                      {friend.occupation && (
                        <p className="text-xs text-gray-500">
                          {friend.occupation}
                        </p>
                      )}
                    </div>
                    <div className="w-5 h-5 border border-gray-300 rounded-sm flex items-center justify-center">
                      {selectedFriends.some((f) => f._id === friend._id) && (
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {friendSearchQuery
                    ? "No friends found"
                    : "You don't have any friends"}
                </div>
              )}
            </div>

            <Button
              onClick={handleCreateGroup}
              disabled={
                groupName.trim() === "" ||
                selectedFriends.length < 2 ||
                isCreatingGroup
              }
              variant="gradientCustom"
              className="mt-4 w-full text-white shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {isCreatingGroup ? "Creating..." : "Create group chat"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
