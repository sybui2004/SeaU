import React from "react";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  senderProfilePic?: string;
  isFile?: boolean;
  fileName?: string;
  fileSize?: string;
  isAudio?: boolean;
  audioDuration?: string;
  isImage?: boolean;
  isVideo?: boolean;
  fileUrl?: string;
  fileData?: string;
  fileType?: "image" | "audio" | "video" | "other" | null;
}

export interface Member {
  name: string;
  isAdmin: boolean;
  proPic?: string;
  _id?: string;
}

export interface FileData {
  name: string;
  size: string;
  url?: string;
  type?: string;
}

export interface ChatMainProps {
  chat: any;
  currentUser: string;
  setSendMessage?: React.Dispatch<React.SetStateAction<any>>;
  receivedMessage?: any;
}

export const getServerPublicPath = (): string => {
  const serverBaseUrl =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";

  if (serverBaseUrl.endsWith("/images/")) {
    return serverBaseUrl.substring(0, serverBaseUrl.length - 8);
  } else if (serverBaseUrl.endsWith("/images")) {
    return serverBaseUrl.substring(0, serverBaseUrl.length - 7);
  }

  return serverBaseUrl;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
