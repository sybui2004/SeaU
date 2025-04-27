import React from "react";
import { Button } from "@/components/ui/button";
import normalCallIcon from "@assets/images/icon-normal-call.png";
import videoCallIcon from "@assets/images/icon-video-call.png";
import threeDotsIcon from "@assets/images/icon-three-dots.png";

// Server path cho avatar
const SERVER_PUBLIC = "http://localhost:3000/images/";

interface ChatHeaderProps {
  chatName: string;
  toggleChatDetail: () => void;
  isGroup?: boolean;
  avatar?: string;
  members?: { name: string; proPic?: string }[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  toggleChatDetail,
  isGroup = false,
  avatar,
  members = [],
}) => {
  // Hiển thị kí tự đầu của tên nếu không có avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "C";
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        {/* Avatar */}
        {avatar ? (
          <img
            src={
              avatar.startsWith("http") ? avatar : `${SERVER_PUBLIC}${avatar}`
            }
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover mr-3"
            onError={(e) => {
              // Nếu load ảnh lỗi, hiển thị kí tự đầu
              (e.target as HTMLImageElement).style.display = "none";
              (
                e.target as HTMLImageElement
              ).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : isGroup ? (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
            {getInitial(chatName)}
          </div>
        ) : members && members.length > 0 && members[0].proPic ? (
          <img
            src={
              members[0].proPic.startsWith("http")
                ? members[0].proPic
                : `${SERVER_PUBLIC}${members[0].proPic}`
            }
            alt={members[0].name}
            className="w-10 h-10 rounded-full object-cover mr-3"
            onError={(e) => {
              // Nếu load ảnh lỗi, hiển thị kí tự đầu
              (e.target as HTMLImageElement).style.display = "none";
              (
                e.target as HTMLImageElement
              ).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold mr-3">
            {members && members.length > 0
              ? getInitial(members[0].name)
              : getInitial(chatName)}
          </div>
        )}
        <div className="hidden w-10 h-10 rounded-full bg-gray-100 items-center justify-center text-gray-600 font-bold mr-3">
          {getInitial(chatName)}
        </div>
        {/* Tên cuộc trò chuyện */}
        <div>
          <span className="text-lg font-medium">{chatName || "New chat"}</span>
          {isGroup && members.length > 0 && (
            <div className="text-xs text-gray-500">
              {members.length} peoples
            </div>
          )}
        </div>
      </div>
      <div className="justify-end">
        <Button variant="ghost" title="Call">
          <img src={normalCallIcon} alt="Call" className="w-7" />
        </Button>
        <Button variant="ghost" title="Video call">
          <img src={videoCallIcon} alt="Video call" className="w-7" />
        </Button>
        <Button variant="ghost" onClick={toggleChatDetail} title="Chat info">
          <img src={threeDotsIcon} alt="Show chat info" className="w-7" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
