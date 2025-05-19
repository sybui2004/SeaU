import React, { useState } from "react";
import { Message, getServerPublicPath } from "./message-utils/MessageTypes";

const SERVER_PUBLIC = getServerPublicPath();

interface MessageBubbleProps {
  message: Message;
  onImageLoad?: () => void;
  onVideoLoad?: () => void;
  showTimestamp?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onImageLoad,
  onVideoLoad,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadFile, setDownloadFile] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isSentByMe = message.sender === "You";

  const getMessageFileUrl = () => {
    if (message.fileUrl) {
      if (message.fileUrl.startsWith("http")) {
        console.log("Using direct HTTP URL:", message.fileUrl);
        return message.fileUrl;
      }

      const serverUrl = `${SERVER_PUBLIC}${
        message.fileUrl.startsWith("/") ? "" : "/"
      }${message.fileUrl}`;
      console.log("Using server URL:", serverUrl);
      return serverUrl;
    }

    if (message.fileData) {
      if (
        message.fileData.startsWith("http") ||
        message.fileData.startsWith("blob:")
      ) {
        console.log("Using data URL direct:", message.fileData);
        return message.fileData;
      }

      const dataUrl = `${SERVER_PUBLIC}${
        message.fileData.startsWith("/") ? "" : "/"
      }${message.fileData}`;
      console.log("Using data URL with server path:", dataUrl);
      return dataUrl;
    }

    console.log("No file URL or data found");
    return "";
  };

  const isImageMessage = () => message.isImage || message.fileType === "image";
  const isVideoMessage = () => message.isVideo || message.fileType === "video";
  const isAudioMessage = () => message.isAudio || message.fileType === "audio";

  const toggleAudio = (audioElement: HTMLAudioElement) => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playing started successfully");
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setTimeout(() => {
              audioElement.load();
              audioElement
                .play()
                .catch((e) => console.error("Second attempt failed:", e));
            }, 300);
          });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = (url: string, filename: string) => {
    setDownloadFile(true);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadFile(false), 2000);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    if (onImageLoad) {
      onImageLoad();
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (onVideoLoad) {
      onVideoLoad();
    }
  };

  const formatTimeTo24Hour = (timestamp: string | Date): string => {
    try {
      console.log("Timestamp received:", timestamp);

      if (!timestamp) {
        console.log("No timestamp provided, using current time");
        return new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }

      const date = new Date(timestamp);

      if (isNaN(date.getTime())) {
        console.log("Invalid timestamp, using fallback");
        return "00:00";
      }

      console.log("Parsed date:", date);
      const timeString = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      console.log("Formatted time:", timeString);
      return timeString;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00";
    }
  };

  return (
    <div
      className={`flex flex-col max-w-[75%] ${
        isSentByMe ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`rounded-lg px-4 py-2 break-words ${
          isSentByMe
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <div className="flex flex-col">
          {!isImageMessage() &&
            !isVideoMessage() &&
            !isAudioMessage() &&
            !message.isFile && (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}

          {isImageMessage() && (
            <div className="mt-2 relative group">
              <img
                src={getMessageFileUrl()}
                alt={message.fileName || "Image"}
                className={`max-w-full h-auto rounded ${
                  isImageLoaded ? "block" : "hidden"
                }`}
                onLoad={handleImageLoad}
                onError={(e) => {
                  console.error("Error loading image:", e);
                  // Thử tải lại nếu lỗi
                  const img = e.target as HTMLImageElement;
                  if (!img.dataset.retried) {
                    img.dataset.retried = "true";
                    setTimeout(() => {
                      const newSrc =
                        getMessageFileUrl() + "?t=" + new Date().getTime();
                      console.log("Retrying image load with:", newSrc);
                      img.src = newSrc;
                    }, 500);
                  }
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() =>
                    handleDownload(
                      getMessageFileUrl(),
                      message.fileName || "image.jpg"
                    )
                  }
                  className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
                  title="Download image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {isVideoMessage() && (
            <div className="mt-2">
              <video
                src={getMessageFileUrl()}
                controls
                className={`max-w-full h-auto rounded ${
                  isVideoLoaded ? "block" : "hidden"
                }`}
                onLoadedData={handleVideoLoad}
                onError={(e) => {
                  console.error("Error loading video:", e);
                  const video = e.target as HTMLVideoElement;
                  if (!video.dataset.retried) {
                    video.dataset.retried = "true";
                    setTimeout(() => {
                      const newSrc =
                        getMessageFileUrl() + "?t=" + new Date().getTime();
                      console.log("Retrying video load with:", newSrc);
                      video.src = newSrc;
                    }, 500);
                  }
                }}
              />
            </div>
          )}

          {isAudioMessage() && (
            <div
              className={`mt-2 p-3 rounded-lg flex items-center ${
                isSentByMe ? "bg-blue-600" : "bg-gray-100"
              }`}
            >
              <button
                onClick={(e) => {
                  const audioElement = e.currentTarget
                    .nextSibling as HTMLAudioElement;
                  toggleAudio(audioElement);
                }}
                className={`p-2 rounded-full mr-3 ${
                  isPlaying
                    ? "bg-red-500 text-white"
                    : isSentByMe
                    ? "bg-white text-blue-600"
                    : "bg-blue-500 text-white"
                } hover:opacity-90 transition-opacity`}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <audio
                src={getMessageFileUrl()}
                onEnded={handleAudioEnded}
                className="hidden"
                preload="auto"
                controls={false}
              />
              <div className="flex-1 flex flex-col">
                <span
                  className={`font-medium text-sm ${
                    isSentByMe ? "text-white" : "text-gray-800"
                  }`}
                >
                  Voice message
                </span>
                <span
                  className={`text-xs ${
                    isSentByMe ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {formatTimeTo24Hour(
                    message.createdAt || message.timestamp || new Date()
                  )}
                </span>
              </div>
              <button
                onClick={() =>
                  handleDownload(
                    getMessageFileUrl(),
                    message.fileName || "voice-message.mp3"
                  )
                }
                className={`ml-2 p-1 rounded-full transition-colors ${
                  isSentByMe
                    ? "text-white hover:bg-blue-700"
                    : "text-blue-500 hover:text-blue-700 hover:bg-gray-200"
                }`}
                title="Download audio"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          )}

          {message.isFile && message.fileType === "other" && (
            <div className="bg-gray-100 p-2 rounded mt-2">
              <a
                href={getMessageFileUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {message.fileName || "File"}
              </a>
            </div>
          )}
          <div
            className={`text-xs mt-1 self-end ${
              isSentByMe ? "text-gray-200" : "text-gray-600"
            }`}
          >
            {formatTimeTo24Hour(
              message.createdAt || message.timestamp || new Date()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
