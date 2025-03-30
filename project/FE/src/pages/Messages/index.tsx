import { useState } from "react";
import { ChatMain, MessageList } from "./components";
import Sidebar from "@/components/layout/Sidebar";
function Messages() {
  const [currentChat, setCurrentChat] = useState({
    id: "1",
    name: "BiTiS's Server",
    isGroup: true,
  });

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="fixed flex ml-15 max-w-[calc(100%-80px)] w-full">
        <div className="max-w-[20%] w-full border-r">
          <MessageList onSelectChat={setCurrentChat} />
        </div>
        <div className="flex-1 w-full">
          <ChatMain currentChat={currentChat} />
        </div>
      </div>
    </div>
  );
}

export default Messages;
