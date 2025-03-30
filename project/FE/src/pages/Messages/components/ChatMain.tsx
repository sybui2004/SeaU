import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import ChatDetail from "./ChatDetail";

import demo from "@assets/images/demo.png";

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

interface ChatMainProps {
  currentChat: {
    id: string;
    name: string;
    isGroup: boolean;
  };
}

function ChatMain({ currentChat }: ChatMainProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "NYC",
      content: demo,
      timestamp: "6:58",
      isImage: true,
    },
    {
      id: "2",
      sender: "NYC",
      content:
        // "",
        "Life in the future is bound to be vastly different from what we experience today. One of the most noticeable changes in the future will be the integration of advanced technologies into our everyday lives. Smart homes will become the norm, where every device is interconnected and controlled by artificial intelligence. From automated appliances to self-driving cars, technology will streamline our daily routines, allowing us to focus more on personal growth and leisure activities. With rapid advancements in technology and a growing global consciousness towards sustainability, the future holds the promise of a more efficient, interconnected, and environmentally conscious way of life.",
      timestamp: "6:58",
    },
    {
      id: "3",
      sender: "You",
      content: "Okay this is our practice on the next week",
      timestamp: "7:00",
    },
    {
      id: "4",
      sender: "You",
      content: "LaptinhWeb.pdf",
      timestamp: "7:00",
      isFile: true,
      fileName: "LaptinhWeb.pdf",
      fileSize: "70 KB",
    },
    {
      id: "5",
      sender: "NYM",
      content: "No Happy",
      timestamp: "7:02",
    },
    {
      id: "6",
      sender: "You",
      content: "audio.mp3",
      timestamp: "7:04",
      isAudio: true,
      audioDuration: "0:03",
    },
    {
      id: "7",
      sender: "You",
      content: "Hello World",
      timestamp: "7:04",
    },
    {
      id: "8",
      sender: "NYM",
      content: "LaptinhWeb.pdf",
      timestamp: "7:06",
      isFile: true,
      fileName: "LaptinhWeb.pdf",
      fileSize: "70 KB",
    },
    {
      id: "9",
      sender: "NYM",
      content: "LaptinhWeb.pdf",
      timestamp: "7:06",
      isFile: true,
      fileName: "LaptinhWeb.pdf",
      fileSize: "70 KB",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [isHovered, setIsHovered] = useState({
    addMember: false,
    chatMessage: false,
  });

  const [selectedTab, setSelectedTab] = useState<"image" | "file">("image");

  const [isChatDetailVisible, setIsChatDetailVisible] = useState(true);

  const members = [
    { name: "NYC", isAdmin: true },
    { name: "NYM", isAdmin: false },
    { name: "You", isAdmin: false },
    { name: "You", isAdmin: false },
    { name: "You", isAdmin: false },
    { name: "You", isAdmin: false },
    { name: "You", isAdmin: false },
  ];

  const files = [
    { name: "LaptinhWeb.pdf", size: "120 KB" },
    { name: "BTL.pdf", size: "120 KB" },
    { name: "BTVN.pdf", size: "120 KB" },
    { name: "BTL.pdf", size: "120 KB" },
    { name: "BTL.pdf", size: "120 KB" },
    { name: "BTL.pdf", size: "120 KB" },
  ];

  return (
    <div className="flex h-full w-full">
      <div
        className={`${
          isChatDetailVisible ? "max-w-[70%]" : "w-full"
        } w-full h-full`}
      >
        <div className="w-full h-full overflow-y-auto">
          <ChatHeader
            chatName={currentChat.name}
            toggleChatDetail={() => setIsChatDetailVisible((prev) => !prev)}
          />

          {/* Chat messages */}
          <div className="overflow-y-auto h-full max-h-[80vh] p-4 space-y-2 w-full custom-scrollbar">
            {messages.map((msg, index) => {
              const showSenderInfo =
                index === 0 ||
                new Date(messages[index].timestamp).getTime() -
                  new Date(messages[index - 1].timestamp).getTime() >
                  60000 ||
                msg.sender !== messages[index - 1]?.sender;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  {showSenderInfo && msg.sender !== "You" && (
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm flex-shrink-0 mr-2">
                      {msg.sender[0]}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {showSenderInfo && (
                      <h2
                        className={`text-sm font-medium ml-2 mr-2 ${
                          msg.sender === "You" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.sender}
                      </h2>
                    )}
                    <MessageBubble
                      message={msg}
                      className={`${showSenderInfo ? "" : "ml-10"}`}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            className={`${
              isChatDetailVisible ? "max-w-[53%]" : "max-w-[75vw]"
            }`}
          />
        </div>
      </div>
      {/* Chat Detail */}
      {isChatDetailVisible && (
        <ChatDetail
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          members={members}
          files={files}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setIsChatDetailVisible={setIsChatDetailVisible}
        />
      )}
    </div>
  );
}

export default ChatMain;
