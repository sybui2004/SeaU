import { format as timeagoFormat } from "timeago.js";
import { Message, formatFileSize } from "./MessageTypes";
import { getFileType } from "./FileHandler";

export const formatMessagesFromAPI = (
  messageData: any[],
  senderDataMap: Map<string, any>,
  currentUser: string
): Message[] => {
  return messageData.map((msg: any) => {
    const senderId =
      typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

    const senderData = senderDataMap.get(senderId);
    const senderName =
      senderId === currentUser ? "You" : senderData?.fullname || "User";

    // Format timestamp to HH:MM and store original date
    let formattedTime;
    let originalDate;
    try {
      originalDate = new Date(msg.createdAt);
      // Store formatted time
      formattedTime = originalDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      console.log(
        `Message ID ${msg._id}: Original date: ${originalDate}, formatted time: ${formattedTime}`
      );
    } catch (error) {
      console.error(`Error formatting time for message ${msg._id}:`, error);
      originalDate = new Date();
      formattedTime = originalDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return {
      id: msg._id,
      sender: senderName,
      content: msg.text,
      timestamp: formattedTime, // Formatted time display (HH:MM)
      senderId: senderId,
      chatId: msg.conversationId,
      createdAt: msg.createdAt || originalDate.toISOString(), // Original date string
      attachments: msg.attachments || [],
      senderProfilePic: senderData?.profilePic,
      isImage:
        msg.fileType === "image" ||
        (msg.attachments &&
          msg.attachments.some((a: any) => a.type?.startsWith("image/"))),
      isAudio:
        msg.fileType === "audio" ||
        (msg.attachments &&
          msg.attachments.some((a: any) => a.type?.startsWith("audio/"))),
      isVideo:
        msg.fileType === "video" ||
        (msg.attachments &&
          msg.attachments.some((a: any) => a.type?.startsWith("video/"))),
      isFile:
        msg.fileType === "other" ||
        (msg.attachments && msg.attachments.length > 0),
      fileName:
        msg.fileName ||
        (msg.attachments && msg.attachments.length > 0
          ? msg.attachments[0].fileName
          : undefined),
      fileSize:
        msg.fileSize ||
        (msg.attachments && msg.attachments.length > 0
          ? msg.attachments[0].fileSize
          : undefined),
      fileUrl:
        msg.fileUrl ||
        (msg.attachments && msg.attachments.length > 0
          ? msg.attachments[0].fileUrl
          : undefined),
      fileData:
        msg.fileData ||
        (msg.attachments && msg.attachments.length > 0
          ? msg.attachments[0].fileData
          : undefined),
      fileType:
        msg.fileType ||
        (msg.attachments && msg.attachments.length > 0
          ? (msg.attachments[0].type?.split("/")[0] as
              | "image"
              | "audio"
              | "video"
              | "other"
              | null)
          : null),
    };
  });
};

export const createTempMessage = (
  message: string,
  currentUser: string,
  chatId: string,
  profilePic?: string,
  fileInfo?: {
    selectedFile?: File | null;
    fileUrl?: string | null;
    fileType?: "image" | "audio" | "video" | "other" | null;
  }
): Message => {
  const now = new Date();

  const timeDisplay = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  console.log(
    `Creating temp message with time: ${timeDisplay} and ISO: ${now.toISOString()}`
  );

  let newMsg: Message = {
    id: Date.now().toString(),
    sender: "You",
    content: message,
    timestamp: timeDisplay,
    senderId: currentUser,
    chatId: chatId,
    createdAt: now.toISOString(),
    senderProfilePic: profilePic,
    isImage: false,
    isAudio: false,
    isVideo: false,
    isFile: false,
    fileType: null,
  };

  if (fileInfo?.selectedFile && fileInfo?.fileUrl) {
    const { selectedFile, fileUrl, fileType } = fileInfo;
    const detectedType = fileType || getFileType(selectedFile);

    newMsg = {
      ...newMsg,
      content: selectedFile.name,
      isImage: detectedType === "image",
      isAudio: detectedType === "audio",
      isVideo: detectedType === "video",
      isFile: true,
      fileName: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      fileData: fileUrl,
      fileUrl: fileUrl,
      fileType: detectedType,
    };
  }

  return newMsg;
};

export const createMessageData = (
  message: string,
  currentUser: string,
  chatId: string,
  fileInfo?: {
    selectedFile?: File | null;
    fileUrl?: string | null;
    fileType?: "image" | "audio" | "video" | "other" | null;
  },
  receiverId?: string
) => {
  return {
    senderId: currentUser,
    text: message,
    chatId: chatId,
    conversationId: chatId,
    receiverId: receiverId,
    fileType: fileInfo?.fileType || null,
    fileData: fileInfo?.fileUrl || null,
    fileUrl: fileInfo?.fileUrl || null,
    fileName: fileInfo?.selectedFile?.name,
    fileSize: fileInfo?.selectedFile?.size,
  };
};
