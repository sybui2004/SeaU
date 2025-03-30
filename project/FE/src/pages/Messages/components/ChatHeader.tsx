import React from "react";
import { Button } from "@/components/ui/button";
import normalCallIcon from "@assets/images/icon-normal-call.png";
import videoCallIcon from "@assets/images/icon-video-call.png";
import threeDotsIcon from "@assets/images/icon-three-dots.png";

interface ChatHeaderProps {
  chatName: string;
  toggleChatDetail: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  toggleChatDetail,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <span className="text-lg font-medium">{chatName}</span>
      <div className="justify-end">
        <Button variant="ghost">
          <img src={normalCallIcon} alt="Normal Call" className="w-7" />
        </Button>
        <Button variant="ghost">
          <img src={videoCallIcon} alt="Video Call" className="w-7" />
        </Button>
        <Button variant="ghost" onClick={toggleChatDetail}>
          <img src={threeDotsIcon} alt="Display chat detail" className="w-7" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
