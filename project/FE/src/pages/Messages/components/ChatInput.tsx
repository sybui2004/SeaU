// src/components/ChatInput.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import fileIcon from "@assets/images/icon-file.png";
import imageIcon from "@assets/images/icon-image.png";
import voiceIcon from "@assets/images/icon-voice.png";
import sentIcon from "@assets/images/icon-sent.png";

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  isHovered: { chatMessage: boolean };
  setIsHovered: React.Dispatch<
    React.SetStateAction<{ addMember: boolean; chatMessage: boolean }>
  >;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  isHovered,
  setIsHovered,
  className,
}) => {
  return (
    <div
      className={`fixed bottom-4 w-full p-2 border-t flex items-center ${className}`}
    >
      <Button variant="ghost" className=" ml-0.5">
        <img src={fileIcon} alt="Sent File" className="w-6" />
      </Button>
      <Button variant="ghost" className="">
        <img src={imageIcon} alt="Sent Image" className="w-8" />
      </Button>
      <Button variant="ghost" className="mr-2">
        <img src={voiceIcon} alt="Sent Voice" className="w-7" />
      </Button>
      <div
        className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
          isHovered.chatMessage
            ? "border-[#1CA7EC] shadow-md"
            : "border-transparent"
        } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
        onMouseEnter={() =>
          setIsHovered((prev) => ({ ...prev, chatMessage: true }))
        }
        onMouseLeave={() =>
          setIsHovered((prev) => ({ ...prev, chatMessage: false }))
        }
      >
        <div className="flex flex-grow w-full overflow-y-auto custom-scrollbar h-full items-center justify-between">
          <textarea
            className="w-full bg-transparent outline-none resize-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
          />
        </div>
      </div>

      <Button variant="ghost" onClick={handleSend} className="ml-2">
        <img src={sentIcon} alt="Sent Message" className="w-7" />
      </Button>
    </div>
  );
};

export default ChatInput;
