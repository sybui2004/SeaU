import React from "react";
import { Button } from "@/components/ui/button";
import fileIcon from "@assets/images/icon-file.png";
import downloadIcon from "@assets/images/icon-download.png";

interface ChatDetailProps {
  isHovered: { addMember: boolean };
  setIsHovered: React.Dispatch<
    React.SetStateAction<{ addMember: boolean; chatMessage: boolean }>
  >;
  members: { name: string; isAdmin: boolean }[];
  files: { name: string; size: string }[];
  selectedTab: "image" | "file";
  setSelectedTab: React.Dispatch<React.SetStateAction<"image" | "file">>;
  setIsChatDetailVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatDetail: React.FC<ChatDetailProps> = ({
  isHovered,
  setIsHovered,
  members,
  files,
  selectedTab,
  setSelectedTab,
  setIsChatDetailVisible,
}) => {
  return (
    <div className="flex-1 w-full border-l h-full bg-white">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Chat Detail</h3>
        <button
          className="text-gray-500"
          onClick={() => setIsChatDetailVisible(false)}
        >
          ×
        </button>
      </div>

      {/* Members section */}
      <div className="p-4 max-h-[32%] h-full">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Member</h4>
          <span className="text-sm text-gray-500">
            {members.length} participants
          </span>
        </div>

        <div className="mt-2 max-h-[75%] border-1 border-[#f1f1f1] overflow-y-auto custom-scrollbar">
          {members.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-pink-500 mr-2">❤️</span>
                <span>{member.name}</span>
              </div>
              <div className="flex items-center">
                {member.isAdmin && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                    Admin
                  </span>
                )}
                <button className="text-gray-500">•••</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-2 ml-2">
          <Button
            variant="gradientCustom"
            className={`flex items-center gap-2 px-3 py-3 mt-1.5 h-10 text-base leading-loose text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)] transition-all duration-300 ${
              isHovered.addMember ? "shadow-lg scale-105" : ""
            } cursor-pointer`}
            onMouseEnter={() =>
              setIsHovered((prev) => ({ ...prev, addMember: true }))
            }
            onMouseLeave={() =>
              setIsHovered((prev) => ({ ...prev, addMember: false }))
            }
          >
            <span className="">+</span>
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Gallery section */}
      <div className="flex flex-1 flex-col p-4 h-full max-h-[50%]">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Gallery</h4>
        </div>

        <div className="flex mt-1 border-b bg-[#F0F0F0] w-full h-10 max-w-[50%] rounded-[20px]">
          <Button
            variant={selectedTab === "image" ? "gradientCustom" : "ghost"}
            className={`flex-1 h-10 text-sm transition-image duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
              selectedTab === "image"
                ? "text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
                : "bg-transparent text-[#1CA7EC]"
            }`}
            onClick={() => setSelectedTab("image")}
          >
            Image
          </Button>
          <Button
            variant={selectedTab === "file" ? "gradientCustom" : "ghost"}
            className={`flex-1 h-10 text-sm transition-image duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
              selectedTab === "file"
                ? "text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
                : "bg-transparent text-[#1CA7EC]"
            }`}
            onClick={() => setSelectedTab("file")}
          >
            File
          </Button>
        </div>

        <div className="space-y-2 overflow-y-auto mt-3 border-1 border-[#f1f1f1] max-h-[50%] custom-scrollbar">
          {files.map((file, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={fileIcon} alt="File" className="w-8 h-auto" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.size}</p>
                </div>
              </div>
              <Button variant="ghost" className="text-blue-500">
                <img src={downloadIcon} alt="download" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
