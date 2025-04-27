import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "@/api/UserRequest";
import { format } from "timeago.js";

// Server public path for images
const serverPublic = "http://localhost:3000/images/";

// MessageAvatar Component
interface MessageAvatarProps {
  avatar?: string;
  username: string;
}

function MessageAvatar({ avatar, username }: MessageAvatarProps) {
  const initials = username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";

            // Find the next element and show it
            const parent = target.parentElement;
            if (parent) {
              const initialsDiv = parent.querySelector("div") as HTMLElement;
              if (initialsDiv) {
                initialsDiv.style.display = "flex";
              }
            }
          }}
        />
      ) : null}
      <div
        className={`w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white ${
          avatar ? "hidden" : ""
        }`}
      >
        {initials}
      </div>
    </div>
  );
}

// MessageListItem Component
interface MessageListItemProps {
  avatar?: string;
  username: string;
  message: any;
  time: string;
  unread?: number;
  onClick?: () => void;
  userData?: any;
  online?: boolean;
}

function MessageListItem({
  avatar,
  username,
  message,
  time,
  unread,
  onClick,
  userData,
  online,
}: MessageListItemProps) {
  // Use userData if provided, otherwise use the props
  const displayName = userData?.fullname || username;

  const displayAvatar = userData?.profilePic
    ? serverPublic + userData.profilePic
    : avatar;

  // Xử lý message có thể là object hoặc string
  const displayMessage = () => {
    if (!message) return "Bắt đầu cuộc trò chuyện";

    if (typeof message === "object") {
      // Nếu message là object, kiểm tra và hiển thị text property
      return message.text || "Bắt đầu cuộc trò chuyện";
    }

    return message;
  };

  return (
    <div
      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative">
        <MessageAvatar avatar={displayAvatar} username={displayName} />
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Nội dung tin nhắn */}
      <div className="flex flex-col ml-3 flex-1">
        {/* Hàng chứa username và time */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm flex-1 truncate">
            {displayName}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>

        {/* Hàng chứa message và unread */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate flex-1">
            {displayMessage()}
          </p>
          {unread ? (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
              {unread}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Main Conversation Component
interface ConversationProps {
  data?: any;
  currentUser?: string;
  onSelectChat?: (chat: { id: string; name: string; isGroup: boolean }) => void;
  online?: boolean;
}

const Conversation = ({
  data,
  currentUser,
  onSelectChat,
  online = false,
}: ConversationProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && currentUser) {
      setIsLoading(true);

      // Sử dụng hàm trích xuất userId
      const userId = extractUserIdFromMembers(data.members, currentUser);
      console.log("userId được trích xuất:", userId);

      // Kiểm tra nếu userId không hợp lệ
      if (!userId) {
        console.error("Không tìm thấy userId hợp lệ");
        setIsLoading(false);
        return;
      }

      const getUserData = async () => {
        try {
          console.log("Gọi API với userId:", userId);
          const { data: fetchedUserData } = await getUser(userId);
          console.log("Dữ liệu người dùng nhận được:", fetchedUserData);
          setUserData(fetchedUserData);
          dispatch({ type: "SAVE_USER", data: fetchedUserData });
        } catch (error) {
          console.log("Lỗi khi lấy dữ liệu người dùng:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (!data.isGroupChat) {
        getUserData();
      } else {
        // Nếu là nhóm chat, không cần lấy dữ liệu người dùng
        setIsLoading(false);
      }
    }
  }, [data, currentUser, dispatch]);

  // Handle chat selection
  const handleSelectChat = (chat: {
    id: string;
    name: string;
    isGroup: boolean;
  }) => {
    console.log("Chọn cuộc trò chuyện:", chat);
    if (chat && chat.id && onSelectChat) {
      try {
        onSelectChat(chat);
        console.log("Đã gọi onSelectChat với:", chat);
      } catch (error) {
        console.error("Lỗi khi chọn cuộc trò chuyện:", error);
      }
    } else {
      console.warn("Thiếu thông tin cuộc trò chuyện hoặc hàm onSelectChat:", {
        chat,
        hasCallback: !!onSelectChat,
      });
    }
  };

  // Xử lý lastMessage
  const processLastMessage = (message: any) => {
    if (!message) return "Bắt đầu cuộc trò chuyện";

    if (typeof message === "object") {
      return message.text || "Bắt đầu cuộc trò chuyện";
    }

    return message;
  };

  // Xử lý tên và avatar nhóm
  const getGroupInfo = (chat: any) => {
    if (!chat) return { name: "Nhóm chat", avatar: undefined };

    return {
      name: chat.groupName || chat.name || "Nhóm chat",
      avatar: chat.groupAvatar ? serverPublic + chat.groupAvatar : undefined,
    };
  };

  // Phân tích members để lấy user ID từ cấu trúc phức tạp
  const extractUserIdFromMembers = (members: any[], currentUserId: string) => {
    if (!Array.isArray(members) || members.length === 0) {
      console.log("Không có thành viên hoặc không phải mảng");
      return null;
    }

    // Lọc để tìm member không phải current user
    const otherMembers = members.filter((member) => {
      // Nếu member là object (như API mới trả về)
      if (typeof member === "object" && member !== null) {
        const memberId = member._id || member.userId || member.id;
        return memberId !== currentUserId;
      }
      // Nếu member là string ID
      return member !== currentUserId;
    });

    if (otherMembers.length === 0) {
      console.log("Không tìm thấy thành viên khác");
      return null;
    }

    const otherMember = otherMembers[0];

    // Nếu member là object, trích xuất ID
    if (typeof otherMember === "object" && otherMember !== null) {
      console.log("Member là object:", otherMember);
      return otherMember._id || otherMember.userId || otherMember.id;
    }

    // Nếu member là string ID
    console.log("Member là string:", otherMember);
    return otherMember;
  };

  return (
    <div className="w-full p-2 hover:bg-gray-50 border-b">
      {/* Chat info */}
      {isLoading ? (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : data ? (
        data.isGroupChat ? (
          // Hiển thị thông tin nhóm chat
          <MessageListItem
            key={data._id}
            username={getGroupInfo(data).name}
            message={processLastMessage(data.lastMessage)}
            time={format(data.updatedAt || Date.now())}
            unread={data.unreadCount || 0}
            avatar={getGroupInfo(data).avatar}
            online={false}
            onClick={() =>
              handleSelectChat({
                id: data._id,
                name: getGroupInfo(data).name,
                isGroup: true,
              })
            }
          />
        ) : userData ? (
          // Hiển thị thông tin chat 1-1
          <MessageListItem
            key={data._id}
            username={userData.fullname || "Người dùng"}
            message={processLastMessage(data.lastMessage)}
            time={format(data.updatedAt || Date.now())}
            unread={data.unreadCount || 0}
            userData={userData}
            online={online}
            onClick={() =>
              handleSelectChat({
                id: data._id,
                name: userData.fullname || "Người dùng",
                isGroup: false,
              })
            }
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Đang tải thông tin người dùng...
          </div>
        )
      ) : (
        <div className="p-4 text-center text-gray-500">
          Không có cuộc trò chuyện. Bắt đầu chat mới!
        </div>
      )}
    </div>
  );
};

export default Conversation;
