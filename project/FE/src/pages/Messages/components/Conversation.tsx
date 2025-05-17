import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "@/api/UserRequest";
import { format } from "timeago.js";

const serverPublic = "http://localhost:3000/images/";

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
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";

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
  const displayName = userData?.fullname || username;

  const displayAvatar = userData?.profilePic
    ? serverPublic + userData.profilePic
    : avatar;

  const displayMessage = () => {
    if (!message) return "Start a conversation";

    if (typeof message === "object") {
      return message.text || "Start a conversation";
    }

    return message;
  };

  return (
    <div
      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <MessageAvatar avatar={displayAvatar} username={displayName} />
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="flex flex-col ml-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm flex-1 truncate">
            {displayName}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>

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
      const userId = extractUserIdFromMembers(data.members, currentUser);

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const getUserData = async () => {
        try {
          const { data: fetchedUserData } = await getUser(userId);
          setUserData(fetchedUserData);
          dispatch({ type: "SAVE_USER", data: fetchedUserData });
        } catch (error) {
          console.log("Error:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (!data.isGroupChat) {
        getUserData();
      } else {
        setIsLoading(false);
      }
    }
  }, [data, currentUser, dispatch]);

  const handleSelectChat = (chat: {
    id: string;
    name: string;
    isGroup: boolean;
  }) => {
    if (chat && chat.id && onSelectChat) {
      try {
        onSelectChat(chat);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.warn("Missing chat info or onSelectChat callback:", {
        chat,
        hasCallback: !!onSelectChat,
      });
    }
  };

  const processLastMessage = (message: any) => {
    if (!message) return "Start a conversation";

    if (typeof message === "object") {
      return message.text || "Start a conversation";
    }

    return message;
  };

  const getGroupInfo = (chat: any) => {
    if (!chat) return { name: "Group chat", avatar: undefined };

    return {
      name: chat.groupName || chat.name || "Nhóm chat",
      avatar: chat.groupAvatar ? serverPublic + chat.groupAvatar : undefined,
    };
  };

  const extractUserIdFromMembers = (members: any[], currentUserId: string) => {
    if (!Array.isArray(members) || members.length === 0) {
      console.log("No members or not an array");
      return null;
    }

    const otherMembers = members.filter((member) => {
      if (typeof member === "object" && member !== null) {
        const memberId = member._id || member.userId || member.id;
        return memberId !== currentUserId;
      }
      return member !== currentUserId;
    });

    if (otherMembers.length === 0) {
      console.log("No other member found");
      return null;
    }

    const otherMember = otherMembers[0];

    if (typeof otherMember === "object" && otherMember !== null) {
      return otherMember._id || otherMember.userId || otherMember.id;
    }
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
          <MessageListItem
            key={data._id}
            username={userData.fullname || "User"}
            message={processLastMessage(data.lastMessage)}
            time={format(data.updatedAt || Date.now())}
            unread={data.unreadCount || 0}
            userData={userData}
            online={online}
            onClick={() =>
              handleSelectChat({
                id: data._id,
                name: userData.fullname || "User",
                isGroup: false,
              })
            }
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Loading user info...
          </div>
        )
      ) : (
        <div className="p-4 text-center text-gray-500">
          No conversation. Start a new chat!
        </div>
      )}
    </div>
  );
};

export default Conversation;
