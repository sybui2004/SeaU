import React, { useState } from "react";
import { format } from "timeago.js";
import { FileIcon, defaultStyles } from "react-file-icon";
const serverBaseUrl =
  import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";
const SERVER_PUBLIC = serverBaseUrl.endsWith("/images/")
  ? serverBaseUrl.substring(0, serverBaseUrl.length - 8)
  : serverBaseUrl.endsWith("/images")
  ? serverBaseUrl.substring(0, serverBaseUrl.length - 7)
  : serverBaseUrl;

interface MessageProps {
  message: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isImage?: boolean;
    isAudio?: boolean;
    isVideo?: boolean;
    isFile?: boolean;
    fileName?: string;
    fileSize?: string;
    fileUrl?: string;
    fileData?: string;
    fileType?: "image" | "audio" | "video" | "other" | null;
  };
  className?: string;
  onImageLoad?: () => void;
  onVideoLoad?: () => void;
}

interface MessageBubbleProps {
  message: MessageProps["message"];
  className?: string;
  onImageLoad?: () => void;
  onVideoLoad?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  className,
  onImageLoad,
  onVideoLoad,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadFile, setDownloadFile] = useState(false);
  const isSentByMe = message.sender === "You";

  const getFileExtension = (filename: string = ""): string => {
    return filename.split(".").pop()?.toLowerCase() || "txt";
  };

  const isServerUrl = (url: string = ""): boolean => {
    return url.startsWith(SERVER_PUBLIC) || url.startsWith("/images/");
  };

  const getFileUrl = (url: string = ""): string => {
    if (!url) return "";
    console.log("Processing URL:", url);

    if (url.startsWith("http")) {
      console.log("URL is already http, returning as is:", url);
      return url;
    }

    if (url.startsWith("/")) {
      const result = `${SERVER_PUBLIC}${url}`;
      console.log("URL starts with /, appending to SERVER_PUBLIC:", result);
      return result;
    } else {
      const result = `${SERVER_PUBLIC}/images/${url}`;
      console.log("URL is file name, appending to images path:", result);
      return result;
    }
  };

  const getMessageFileUrl = (): string => {
    console.log("Getting file URL for message:", message.id);
    console.log("Message file properties:", {
      fileData: message.fileData,
      fileUrl: message.fileUrl,
      content: message.content,
      fileType: message.fileType,
      isImage: message.isImage,
      isVideo: message.isVideo,
      isAudio: message.isAudio,
      isFile: message.isFile,
    });

    try {
      if (message.fileData) {
        if (message.fileData.startsWith("blob:")) {
          console.log("Detected blob URL in fileData, not using it directly");
          if (message.content && !message.content.startsWith("blob:")) {
            return getFileUrl(message.content);
          }
          return "";
        }

        const url = getFileUrl(message.fileData);
        console.log("Using fileData:", url);
        return url;
      }

      if (message.fileUrl) {
        if (message.fileUrl.startsWith("blob:")) {
          console.log("Detected blob URL in fileUrl, not using it directly");
          if (message.content && !message.content.startsWith("blob:")) {
            return getFileUrl(message.content);
          }
          return "";
        }

        const url = getFileUrl(message.fileUrl);
        console.log("Using fileUrl:", url);
        return url;
      }

      if (message.fileType && message.content) {
        if (message.content.startsWith("blob:")) {
          console.log("Detected blob URL in content, not using it directly");
          return "";
        }

        const url = getFileUrl(message.content);
        console.log("Using content with fileType:", url);
        return url;
      }

      if (
        message.content &&
        (message.isImage ||
          message.isAudio ||
          message.isVideo ||
          message.isFile)
      ) {
        if (message.content.startsWith("blob:")) {
          console.log("Detected blob URL in content, not using it directly");
          return "";
        }

        const url = getFileUrl(message.content);
        console.log("Using content with media flag:", url);
        return url;
      }

      console.log("No file URL found for message");
      return "";
    } catch (error) {
      console.error("Error in getMessageFileUrl:", error);
      return "";
    }
  };

  const isImageMessage = () => {
    return Boolean(
      message.isImage ||
        (message.fileType && message.fileType.includes("image")) ||
        (message.fileData &&
          message.fileType &&
          message.fileType.includes("image")) ||
        (message.content &&
          message.content.match(/\.(jpeg|jpg|gif|png)$/) &&
          !message.isFile)
    );
  };

  const isVideoMessage = () => {
    return Boolean(
      message.isVideo ||
        (message.fileType && message.fileType.includes("video")) ||
        (message.fileData &&
          message.fileType &&
          message.fileType.includes("video")) ||
        (message.content &&
          message.content.match(/\.(mp4|webm|ogg|avi|mov|flv|wmv)$/) &&
          !message.isFile)
    );
  };

  const isAudioMessage = () => {
    return Boolean(
      message.isAudio ||
        (message.fileType && message.fileType.includes("audio")) ||
        (message.fileData &&
          message.fileType &&
          message.fileType.includes("audio")) ||
        (message.content &&
          message.content.match(/\.(mp3|wav|ogg|m4a|aac)$/) &&
          !message.isFile)
    );
  };

  const toggleAudio = (audioElement: HTMLAudioElement) => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
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

  return (
    <div
      className={`group rounded-lg p-2 max-w-xs md:max-w-md lg:max-w-lg relative ${
        isSentByMe
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white self-end"
          : "bg-gray-100 text-gray-800 self-start"
      } ${className}`}
    >
      {isImageMessage() && (
        <div className="rounded overflow-hidden mb-1">
          <img
            src={getMessageFileUrl()}
            alt="Image"
            className="max-w-full h-auto object-contain max-h-60 rounded"
            onClick={() => window.open(getMessageFileUrl(), "_blank")}
            onLoad={onImageLoad}
            onError={(e) => {
              console.error("Error loading image:", e);
              const target = e.currentTarget as HTMLImageElement;
              const originalSrc = target.src;

              console.log("Failed loading image from:", originalSrc);
              console.log("Message data:", {
                fileData: message.fileData,
                fileUrl: message.fileUrl,
                content: message.content,
                fileType: message.fileType,
              });

              try {
                let alternativeSrc = "";

                if (
                  !originalSrc.includes("/images/") &&
                  !originalSrc.startsWith("blob:")
                ) {
                  const fileName = originalSrc.split("/").pop() || "";
                  if (fileName) {
                    alternativeSrc = `${SERVER_PUBLIC}/images/${fileName}`;
                    console.log(
                      "Trying alternative path with /images/:",
                      alternativeSrc
                    );
                  }
                }

                else if (originalSrc.includes("/images/")) {
                  if (message.fileData && message.fileData !== originalSrc) {
                    alternativeSrc = message.fileData;
                    console.log("Trying fileData directly:", alternativeSrc);
                  } else if (
                    message.fileUrl &&
                    message.fileUrl !== originalSrc
                  ) {
                    alternativeSrc = message.fileUrl;
                    console.log("Trying fileUrl directly:", alternativeSrc);
                  } else if (
                    message.content &&
                    !message.content.includes(originalSrc)
                  ) {
                    alternativeSrc = message.content;
                    console.log("Trying content directly:", alternativeSrc);
                  }
                }

                if (!alternativeSrc && (message.fileData || message.content)) {
                  const directPath = message.fileData || message.content || "";
                  if (directPath) {
                    if (directPath.startsWith("http")) {
                      alternativeSrc = directPath;
                    } else if (directPath.startsWith("/")) {
                      alternativeSrc = `${SERVER_PUBLIC}${directPath}`;
                    } else {
                      alternativeSrc = `${SERVER_PUBLIC}/images/${directPath}`;
                    }
                    console.log("Trying constructed URL:", alternativeSrc);
                  }
                }

                if (alternativeSrc && alternativeSrc !== originalSrc) {
                  target.src = alternativeSrc;
                } else {
                  throw new Error("No alternative source found");
                }
              } catch (error) {
                console.error("Failed to load image with alternatives:", error);
                target.style.display = "none";
                const container = target.parentElement;
                if (container) {
                  const fallbackElement = document.createElement("div");
                  fallbackElement.className =
                    "flex flex-col items-center justify-center bg-gray-100 rounded p-4";
                  fallbackElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="text-xs text-gray-500 mt-2">Không thể tải ảnh</span>
                  `;
                  container.appendChild(fallbackElement);
                }
              }
            }}
          />
        </div>
      )}

      {isAudioMessage() && (
        <div className="flex flex-col space-y-2 my-1">
          <div className="audio-filename text-xs opacity-75">
            {message.fileName || "Voice message"}
            {message.fileSize && (
              <span className="ml-1">({message.fileSize})</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                const audio = e.currentTarget
                  .nextElementSibling as HTMLAudioElement;
                toggleAudio(audio);
              }}
              className={`p-2 rounded-full ${
                isSentByMe
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={isPlaying ? "Pause" : "Play"}
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
              controls={false}
              className="hidden"
            />
          </div>
        </div>
      )}

      {isVideoMessage() && (
        <div className="rounded overflow-hidden mb-1 video-container">
          <div className="video-filename text-xs opacity-75 mb-1">
            {message.fileName || "Video message"}
            {message.fileSize && (
              <span className="ml-1">({message.fileSize})</span>
            )}
          </div>
          <video
            src={getMessageFileUrl()}
            controls
            className="max-w-full h-auto object-contain max-h-60 rounded"
            onLoadedData={onVideoLoad}
            onError={(e) => {
              console.error("Error loading video:", e);
              const target = e.currentTarget as HTMLVideoElement;
              const originalSrc = target.src;

              console.log("Failed loading video from:", originalSrc);
              console.log("Message data:", {
                fileData: message.fileData,
                fileUrl: message.fileUrl,
                content: message.content,
                fileType: message.fileType,
              });

              try {
                let alternativeSrc = "";

                if (
                  !originalSrc.includes("/video/") &&
                  !originalSrc.startsWith("blob:")
                ) {
                  const fileName = originalSrc.split("/").pop() || "";
                  if (fileName) {
                    alternativeSrc = `${SERVER_PUBLIC}/video/${fileName}`;
                    console.log(
                      "Trying alternative path with /video/:",
                      alternativeSrc
                    );
                  }
                }

                else if (
                  originalSrc.includes("/video/") ||
                  originalSrc.includes("/images/")
                ) {
                  if (message.fileData && message.fileData !== originalSrc) {
                    alternativeSrc = message.fileData;
                    console.log("Trying fileData directly:", alternativeSrc);
                  } else if (
                    message.fileUrl &&
                    message.fileUrl !== originalSrc
                  ) {
                    alternativeSrc = message.fileUrl;
                    console.log("Trying fileUrl directly:", alternativeSrc);
                  } else if (
                    message.content &&
                    !message.content.includes(originalSrc)
                  ) {
                    alternativeSrc = message.content;
                    console.log("Trying content directly:", alternativeSrc);
                  }
                }

                if (!alternativeSrc && (message.fileData || message.content)) {
                  const directPath = message.fileData || message.content || "";
                  if (directPath) {
                    if (directPath.startsWith("http")) {
                      alternativeSrc = directPath;
                    } else if (directPath.startsWith("/")) {
                      alternativeSrc = `${SERVER_PUBLIC}${directPath}`;
                    } else {
                      const videoPath = `${SERVER_PUBLIC}/video/${directPath}`;
                      const imagePath = `${SERVER_PUBLIC}/images/${directPath}`;
                      alternativeSrc =
                        message.fileType === "video" ? videoPath : imagePath;
                    }
                    console.log("Trying constructed URL:", alternativeSrc);
                  }
                }

                if (alternativeSrc && alternativeSrc !== originalSrc) {
                  target.src = alternativeSrc;
                } else {
                  throw new Error("No alternative source found");
                }
              } catch (error) {
                console.error("Failed to load video with alternatives:", error);
                target.style.display = "none";
                const container = target.closest(".video-container");
                if (container) {
                  const fallbackElement = document.createElement("div");
                  fallbackElement.className =
                    "flex flex-col items-center justify-center bg-gray-100 rounded p-4";
                  fallbackElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="text-xs text-gray-500 mt-2">Không thể tải video</span>
                  `;
                  container.appendChild(fallbackElement);
                }
              }
            }}
          />
        </div>
      )}

      {(message.isFile ||
        (message.fileData && message.fileType === "other") ||
        message.fileName) && (
        <div
          className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:bg-opacity-10 hover:bg-white transition-colors"
          onClick={() =>
            handleDownload(getMessageFileUrl(), message.fileName || "file")
          }
        >
          <div className="w-8">
            <FileIcon
              extension={getFileExtension(message.fileName)}
              {...defaultStyles[
                getFileExtension(message.fileName) as keyof typeof defaultStyles
              ]}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {message.fileName || "File"}
            </p>
            <p className="text-xs opacity-70">
              {message.fileSize || "Unknown size"}
              {downloadFile && " • Downloading..."}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              isSentByMe ? "text-blue-100" : "text-gray-500"
            }`}
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
        </div>
      )}

      {message.content &&
        !message.isImage &&
        !message.isAudio &&
        !message.isVideo &&
        !message.isFile && (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}

      {/* Timestamp */}
      <div
        className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 ${
          isSentByMe ? "left-2" : "right-2"
        } ${isSentByMe ? "text-blue-100" : "text-gray-500"}`}
      >
        {format(message.timestamp)}
      </div>
    </div>
  );
};

export default MessageBubble;
