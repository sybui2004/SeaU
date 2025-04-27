// src/components/ChatInput.tsx
import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaFileUpload, FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

interface ChatInputProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  handleSend: () => void;
  isHovered: { addMember: boolean; chatMessage: boolean };
  setIsHovered: Dispatch<
    SetStateAction<{ addMember: boolean; chatMessage: boolean }>
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
  // Thêm state cho các tính năng
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Xử lý gửi tin nhắn khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      // Xóa file sau khi gửi
      setFile(null);
    }
  };

  // Mở dialog chọn file
  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Xử lý ghi âm
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ở đây thường sẽ có logic ghi âm thực tế
    if (isRecording) {
      // Logic dừng ghi âm
      console.log("Dừng ghi âm");
    } else {
      // Logic bắt đầu ghi âm
      console.log("Bắt đầu ghi âm");
    }
  };

  // Xử lý khi click vào nút gửi
  const onSend = () => {
    handleSend();
    setFile(null);
    setShowEmoji(false);
  };

  return (
    <div className={`p-4 ${className || ""}`}>
      <div className="flex items-center">
        {/* Chọn emoji */}
        <div className="relative mr-3">
          <button
            type="button"
            className={`text-xl text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full ${
              showEmoji ? "bg-blue-100" : ""
            }`}
            onClick={() => setShowEmoji(!showEmoji)}
            aria-label="Choose emoji"
            title="Choose emoji"
          >
            <BsEmojiSmile />
          </button>
          {showEmoji && (
            <div className="absolute bottom-12 left-0 z-10 shadow-lg rounded-lg">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setMessage((prev) => prev + emojiData.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Chọn file */}
        <div className="mr-3">
          <button
            type="button"
            className="text-xl text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full"
            onClick={handleOpenFileDialog}
            aria-label="Attach file"
            title="Attach file"
          >
            <FaFileUpload />
          </button>
          <input
            className="hidden"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            aria-label="Choose file"
            title="Choose file"
          />
        </div>

        {/* Ghi âm */}
        <div className="mr-3">
          <button
            type="button"
            className={`text-xl transition-colors p-2 rounded-full ${
              isRecording
                ? "text-red-500 bg-red-100"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={toggleRecording}
            aria-label="Record message"
            title="Record message"
          >
            <FaMicrophone />
          </button>
        </div>

        {/* Input và nút gửi */}
        <div className="flex-1 relative">
          {file && (
            <div className="mb-2 p-2 bg-blue-50 rounded flex items-center justify-between">
              <span className="text-sm truncate max-w-[80%]">{file.name}</span>
              <button
                className="text-red-500 hover:text-red-700 text-sm"
                onClick={() => setFile(null)}
              >
                ×
              </button>
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={file ? "Add description..." : "Enter message..."}
            className={`w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 transition-all duration-300 resize-none overflow-hidden ${
              isHovered.chatMessage
                ? "focus:ring-blue-400 border-blue-300"
                : "focus:ring-gray-300"
            }`}
            rows={1}
            onFocus={() =>
              setIsHovered((prev) => ({ ...prev, chatMessage: true }))
            }
            onBlur={() =>
              setIsHovered((prev) => ({ ...prev, chatMessage: false }))
            }
          />
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer p-2 rounded-full ${
              message.trim() || file
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={onSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
