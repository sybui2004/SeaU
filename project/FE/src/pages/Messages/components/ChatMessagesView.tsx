import React, { RefObject } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "./message-utils/MessageTypes";
import { format as timeagoFormat } from "timeago.js";
import { getServerPublicPath } from "./message-utils/MessageTypes";

interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onScroll: () => void;
  chatEndRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
}

const SERVER_PUBLIC = getServerPublicPath();

const ChatMessagesView: React.FC<ChatMessagesViewProps> = ({
  messages,
  isLoading,
  isLoadingMore,
  onScroll,
  chatEndRef,
  containerRef,
}) => {
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 w-full custom-scrollbar relative"
      onScroll={onScroll}
    >
      {isLoadingMore && (
        <div className="flex justify-center items-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-500">
            Loading older messages...
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : messages.length > 0 ? (
        <>
          {messages.map((msg, index) => {
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
                            : `${SERVER_PUBLIC}/images/${msg.senderProfilePic}`
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
                      {msg.sender}
                    </h2>
                  )}
                  <MessageBubble
                    message={{
                      id: msg.id,
                      sender: msg.sender,
                      content: msg.content,
                      timestamp: timeagoFormat(msg.createdAt || new Date()),
                      isImage: msg.isImage,
                      isAudio: msg.isAudio,
                      isVideo: msg.isVideo,
                      isFile: msg.isFile,
                      fileName: msg.fileName,
                      fileSize: msg.fileSize,
                      fileUrl: msg.fileUrl,
                      fileData: msg.fileData,
                      fileType: msg.fileType,
                    }}
                    className={`${
                      !isSentByMe && !showSenderInfo ? "ml-10" : ""
                    }`}
                    onImageLoad={() => {
                      if (chatEndRef.current && index === messages.length - 1) {
                        chatEndRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                    onVideoLoad={() => {
                      if (chatEndRef.current && index === messages.length - 1) {
                        chatEndRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </>
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
  );
};

export default ChatMessagesView;
