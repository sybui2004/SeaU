// src/components/MessageBubble.tsx
import React from "react";
import fileIcon from "@assets/images/icon-file.png";
import fileIconU from "@assets/images/icon-file-from-you.png";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isFile?: boolean;
  fileName?: string;
  fileSize?: string;
  isAudio?: boolean;
  audioDuration?: string;
  isImage?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  className,
}) => {
  return (
    <div
      className={`max-w-xs px-4 py-2 rounded-lg break-words whitespace-pre-wrap ${
        message.sender === "You"
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-black"
      } ${className}`}
    >
      {message.isFile ? (
        <div className="flex items-center space-x-1">
          <img
            src={message.sender === "You" ? fileIconU : fileIcon}
            alt="File"
            className="w-6"
          />
          <div>
            <p className="font-medium ml-2">{message.fileName}</p>
            <p
              className={`text-sm ml-2 ${
                message.sender === "You" ? " text-white" : " text-black"
              }`}
            >
              {message.fileSize}
            </p>
          </div>
        </div>
      ) : message.isAudio ? (
        <div className="flex items-center space-x-2">
          <audio controls className="w-70">
            <source src={message.content} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : message.isImage ? (
        <img
          src={message.content}
          alt="image"
          className="w-full h-auto rounded-lg"
        />
      ) : (
        <p>{message.content}</p>
      )}
      <p
        className={`text-xs  mt-1 text-right ${
          message.sender === "You" ? " text-white" : " text-gray-400"
        }`}
      >
        {message.timestamp}
      </p>
    </div>
  );
};

export default MessageBubble;
