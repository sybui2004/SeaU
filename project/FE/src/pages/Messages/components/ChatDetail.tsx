import React from "react";
import { Button } from "@/components/ui/button";
import fileIcon from "@assets/images/icon-file.png";
import downloadIcon from "@assets/images/icon-download.png";
import { UserPlus, UserX } from "lucide-react";

// Đường dẫn đến server hình ảnh
const SERVER_PUBLIC = "http://localhost:3000/images/";

interface Member {
  name: string;
  isAdmin: boolean;
  proPic?: string;
}

interface ChatDetailProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
  members: Member[];
  isMobile?: boolean;
  currentUser: string;
  groupAdmin?: string;
  files: { name: string; size: string }[];
  selectedTab: "image" | "file";
  setSelectedTab: React.Dispatch<React.SetStateAction<"image" | "file">>;
}

const ChatDetail: React.FC<ChatDetailProps> = ({
  isOpen,
  chat,
  members,
  isMobile,
  currentUser,
  groupAdmin,
  files,
  selectedTab,
  setSelectedTab,
}) => {
  // Kiểm tra xem chat có phải là nhóm không
  const isGroup = chat?.isGroupChat;

  // Tính số thành viên thực tế, loại bỏ người dùng hiện tại
  const memberCount = isGroup ? members.length : 2;

  // Log số lượng thành viên để debug
  console.log("Members in chat:", members);
  console.log("Member count:", memberCount);

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "translate-x-full"
      } fixed right-0 top-0 z-30 h-full w-72 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900 ${
        isMobile ? "w-full" : "border-l dark:border-gray-800"
      }`}
    >
      <div className="p-4">
        <div className="mb-6 flex flex-col items-center">
          {isGroup ? (
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-200">
              {chat?.chatName?.charAt(0).toUpperCase() || "G"}
            </div>
          ) : members.length > 0 && members[0]?.proPic ? (
            <img
              src={
                members[0].proPic.startsWith("http")
                  ? members[0].proPic
                  : `${SERVER_PUBLIC}${members[0].proPic}`
              }
              alt={members[0].name}
              className="mb-2 h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Tạo div hiển thị chữ cái đầu thay thế
                const parent = target.parentNode;
                const div = document.createElement("div");
                div.className =
                  "mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300";
                div.textContent = members[0].name.charAt(0).toUpperCase();
                if (parent) parent.appendChild(div);
              }}
            />
          ) : (
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {members.length > 0
                ? members[0].name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isGroup
              ? chat?.chatName
              : members.length > 0
              ? members[0].name
              : "Người dùng"}
          </h3>

          {isGroup && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {memberCount} people joined
            </p>
          )}
        </div>

        {isGroup && (
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
              Group members
            </h4>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    {member.proPic ? (
                      <>
                        <img
                          src={
                            member.proPic.startsWith("http")
                              ? member.proPic
                              : `${SERVER_PUBLIC}${member.proPic}`
                          }
                          alt={member.name}
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            // Nếu ảnh lỗi, hiển thị chữ cái đầu
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            const parent = (e.target as HTMLImageElement)
                              .parentNode;
                            // Tạo div hiển thị chữ cái đầu
                            const fallbackDiv = document.createElement("div");
                            fallbackDiv.className =
                              "mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300";
                            fallbackDiv.textContent = member.name
                              .charAt(0)
                              .toUpperCase();
                            if (parent) parent.appendChild(fallbackDiv);
                          }}
                        />
                      </>
                    ) : (
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      {member.isAdmin && (
                        <span className="text-xs text-blue-500 dark:text-blue-400">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  {currentUser === groupAdmin && member.name !== "Bạn" && (
                    <button
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      aria-label={`Xóa ${member.name} khỏi nhóm`}
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isGroup && currentUser === groupAdmin && (
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <button className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add members
            </button>
          </div>
        )}
      </div>

      {/* Gallery section */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Gallery</h4>
        </div>

        <div className="flex mt-1 border-b bg-[#F0F0F0] h-10 max-w-[50%] rounded-[20px]">
          <Button
            variant={selectedTab === "image" ? "gradientCustom" : "ghost"}
            className={`flex-1 h-10 text-sm transition-image duration-300 hover:bg-[#DCDCDC] rounded-[20px] ${
              selectedTab === "image"
                ? "text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)]"
                : "bg-transparent text-[#1CA7EC]"
            }`}
            onClick={() => setSelectedTab("image")}
          >
            Images
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
            Files
          </Button>
        </div>

        <div className="overflow-y-auto mt-3 flex-1 custom-scrollbar">
          {files && files.length > 0 ? (
            files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <img src={fileIcon} alt="File" className="w-8 h-auto" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.size}</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-blue-500">
                  <img src={downloadIcon} alt="Tải xuống" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No files attached
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
