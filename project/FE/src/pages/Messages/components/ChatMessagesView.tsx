import React from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "./message-utils/MessageTypes";
interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onScroll: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isGroupChat?: boolean;
}

const ChatMessagesView: React.FC<ChatMessagesViewProps> = ({
  messages,
  isLoading,
  isLoadingMore,
  onScroll,
  chatEndRef,
  containerRef,
  isGroupChat,
}) => {
  const handleImageLoad = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleVideoLoad = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-2"
      onScroll={onScroll}
      ref={containerRef}
    >
      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {messages.map((message, index) => {
            const isSentByMe = message.sender === "You";
            const prevMessage = index > 0 ? messages[index - 1] : null;

            // Determine if this message should show sender info
            const showSenderInfo =
              isGroupChat &&
              !isSentByMe &&
              (!prevMessage || prevMessage.senderId !== message.senderId);

            return (
              <div
                key={message.id}
                className={`flex flex-col ${
                  isSentByMe ? "items-end" : "items-start"
                }`}
              >
                {showSenderInfo && (
                  <div className="text-xs text-gray-500 ml-2 mb-1">
                    {message.sender}
                  </div>
                )}
                <MessageBubble
                  message={message}
                  onImageLoad={handleImageLoad}
                  onVideoLoad={handleVideoLoad}
                />
              </div>
            );
          })}
          <div ref={chatEndRef}></div>
        </div>
      )}
    </div>
  );
};

export default ChatMessagesView;
