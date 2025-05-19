import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "@/api/UserRequest";

interface ConversationProps {
  data?: any;
  currentUser?: string;
  onSelectChat?: (chat: { id: string; name: string; isGroup: boolean }) => void;
}

const Conversation = ({
  data,
  currentUser,
  onSelectChat,
}: ConversationProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && currentUser) {
      console.log("Conversation data:", data);
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

  const handleSelectChat = () => {
    if (data && data._id && onSelectChat) {
      try {
        onSelectChat({
          id: data._id,
          name: data.isGroupChat
            ? data.groupName || "Group chat"
            : userData?.fullname || "User",
          isGroup: data.isGroupChat || false,
        });
      } catch (error) {
        console.error("Error selecting chat:", error);
      }
    }
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
    <div
      className={`flex items-center p-3 border-b hover:bg-gray-50 transition-colors cursor-pointer ${
        data?.unreadCount ? "bg-blue-50" : ""
      }`}
      onClick={handleSelectChat}
    >
      {/* Avatar */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : data?.isGroupChat ? (
          data?.groupAvatar ? (
            <img
              src={`${import.meta.env.VITE_PUBLIC_FOLDER}${data.groupAvatar}`}
              alt="Group"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              G
            </div>
          )
        ) : userData?.profilePic ? (
          <img
            src={`${import.meta.env.VITE_PUBLIC_FOLDER}${userData.profilePic}`}
            alt={userData?.fullname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {userData?.fullname?.charAt(0) || "U"}
          </div>
        )}
      </div>

      {/* Chat details*/}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-zinc-900 truncate">
            {data?.isGroupChat
              ? data.groupName || "Group chat"
              : isLoading
              ? "Loading..."
              : userData?.fullname || "User"}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
