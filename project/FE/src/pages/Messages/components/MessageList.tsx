import { useState } from "react";
import MessageListItem from "./MessageListItem";
import searchIcon from "@assets/images/icon-search.png";
import { Button } from "@/components/ui/button";

interface MessageListProps {
  onSelectChat: (chat: { id: string; name: string; isGroup: boolean }) => void;
}

function MessageList({ onSelectChat }: MessageListProps) {
  const messages = [
    {
      id: "1",
      name: "BiTiS's Server",
      isGroup: true,
      message: "You: Hello World",
      time: "7:00",
      unread: 0,
    },
    {
      id: "2",
      name: "NTC",
      isGroup: false,
      message: "Like",
      time: "Jan 12th",
      unread: 1,
    },
    {
      id: "3",
      name: "My love",
      isGroup: false,
      message: "Go home now",
      time: "Jan 11th",
      unread: 0,
    },
    {
      id: "4",
      name: "Class ATBMATT",
      isGroup: true,
      message: "NTC: Hello",
      time: "Dec 29th 24",
      unread: 1,
    },
    {
      id: "5",
      name: "MA",
      isGroup: false,
      message: "Gold Skeleton",
      time: "Dec 28th 24",
      unread: 0,
    },
    {
      id: "6",
      name: "BE Team",
      isGroup: true,
      message: "N/A: Code for this project",
      time: "Dec 28th 24",
      unread: 0,
    },
    {
      id: "7",
      name: "FE Team",
      isGroup: true,
      message: "President: Code nowww",
      time: "Dec 27th 24",
      unread: 0,
    },
    {
      id: "8",
      name: "Gym",
      isGroup: false,
      message: "Let's plank 1 minute",
      time: "Dec 26th 24",
      unread: 3,
    },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | "direct" | "group">(
    "all"
  );

  // Filter messages based on selected tab
  const filteredMessages = messages.filter((chat) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "direct") return !chat.isGroup;
    if (selectedTab === "group") return chat.isGroup;
    return true;
  });

  return (
    <div className="flex flex-col items-center justify-center mt-2 ml-2 h-full w-full">
      <div className="font-bold text-zinc-900 text-2xl tracking-tight cursor-pointer">
        Message
      </div>
      {/* Search bar */}
      <div className="flex items-center justify-center w-full max-w-[90%] mt-2">
        <div
          className={`flex overflow-hidden items-center w-full h-12 px-4 leading-none rounded-3xl border border-solid bg-zinc-100 transition-all duration-300 ${
            isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
          } text-zinc-900 max-md:px-5 max-md:max-w-full`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={searchIcon}
            className={`object-contain shrink-0 w-[16px] mr-1 transition-transform duration-300 ${
              isHovered ? "scale-110" : ""
            }`}
            alt="Search icon"
          />
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Chat filter tabs */}
      <div className="flex mt-2 border-b bg-[#F0F0F0] w-full h-12 max-w-[90%] rounded-[20px]">
        <Button
          variant={selectedTab === "all" ? "gradientCustom" : "ghost"}
          className={`flex-1 h-full text-sm transition-all duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
            selectedTab === "all"
              ? "text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
              : "bg-transparent text-[#1CA7EC]"
          }`}
          onClick={() => setSelectedTab("all")}
        >
          All
        </Button>
        <Button
          variant={selectedTab === "direct" ? "gradientCustom" : "ghost"}
          className={`flex-1 h-full text-sm transition-all duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
            selectedTab === "direct"
              ? "text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
              : "bg-transparent text-[#1CA7EC]"
          }`}
          onClick={() => setSelectedTab("direct")}
        >
          Direct
        </Button>
        <Button
          variant={selectedTab === "group" ? "gradientCustom" : "ghost"}
          className={`flex-1 h-full text-sm transition-all duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
            selectedTab === "group"
              ? "text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
              : "bg-transparent text-[#1CA7EC]"
          }`}
          onClick={() => setSelectedTab("group")}
        >
          Group
        </Button>
      </div>

      {/* Message list */}
      <div className="flex-1 mt-2 overflow-hidden w-full p-2">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full custom-scrollbar">
          {filteredMessages.map((chat) => (
            <div
              key={chat.id}
              onClick={() =>
                onSelectChat({
                  id: chat.id,
                  name: chat.name,
                  isGroup: chat.isGroup,
                })
              }
            >
              <MessageListItem
                username={chat.name}
                message={chat.message}
                time={chat.time}
                unread={chat.unread}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageList;
