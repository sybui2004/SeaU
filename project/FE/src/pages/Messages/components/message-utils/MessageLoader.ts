import { getMessages } from "@/api/MessageRequest";
import { getUser } from "@/api/UserRequest";
import { Message, FileData, formatFileSize } from "./MessageTypes";
import { format as timeagoFormat } from "timeago.js";

export const loadMessages = async (
  conversationId: string,
  currentUser: string,
  currentUserProfilePic?: string,
  page = 1,
  limit = 20
): Promise<{ messages: Message[]; fileData: FileData[] }> => {
  try {
    console.log(
      `Loading messages for conversation ${conversationId}, page ${page}`
    );
    const response = await getMessages(conversationId, page, limit);
    console.log("API response:", response);

    let messageData = response.data;
    if (response.data && response.data.messages) {
      messageData = response.data.messages;
    }

    if (!messageData || messageData.length === 0) {
      console.log("No messages found");
      return { messages: [], fileData: [] };
    }

    const senderIds = [
      ...new Set(
        messageData.map((msg: any) =>
          typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId
        )
      ),
    ].filter((id): id is string => typeof id === "string");

    console.log("Unique sender IDs:", senderIds);

    const senderDataMap = new Map();
    senderDataMap.set(currentUser, {
      fullname: "You",
      profilePic: currentUserProfilePic,
    });

    for (const senderId of senderIds) {
      if (senderId !== currentUser) {
        try {
          const { data } = await getUser(senderId);
          senderDataMap.set(senderId, {
            fullname: data.fullname || data.username || "User",
            profilePic: data.profilePic,
          });
        } catch (error) {
          console.error(`Error fetching user data for ${senderId}:`, error);
          senderDataMap.set(senderId, {
            fullname: "User",
            profilePic: undefined,
          });
        }
      }
    }

    const formattedMessages = messageData.map((msg: any) => {
      const senderId =
        typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

      const senderData = senderDataMap.get(senderId);
      const senderName =
        senderId === currentUser ? "You" : senderData?.fullname || "User";

      return {
        id: msg._id,
        sender: senderName,
        content: msg.text,
        timestamp: timeagoFormat(msg.createdAt),
        senderId: senderId,
        chatId: msg.conversationId,
        createdAt: msg.createdAt,
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
        fileSize: msg.fileSize
          ? formatFileSize(Number(msg.fileSize))
          : msg.attachments && msg.attachments.length > 0
          ? msg.attachments[0].fileSize
          : undefined,
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

    // Extract file data from messages
    const fileData: FileData[] = [];

    // First get files from message fileUrl fields
    messageData.forEach((msg: any) => {
      // Check for fileData/fileUrl directly on the message
      if (msg.fileData || msg.fileUrl) {
        const fileType =
          msg.fileType ||
          (msg.fileName && msg.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            ? "image"
            : msg.fileName && msg.fileName.match(/\.(mp4|webm|mov|avi)$/i)
            ? "video"
            : msg.fileName && msg.fileName.match(/\.(mp3|wav|ogg)$/i)
            ? "audio"
            : "other");

        fileData.push({
          name: msg.fileName || "File",
          size: msg.fileSize ? formatFileSize(Number(msg.fileSize)) : "Unknown",
          url: msg.fileUrl || msg.fileData,
          type: fileType,
        });
      }

      // Check for attachments
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach((attachment: any) => {
          fileData.push({
            name: attachment.fileName || "File attachment",
            size: attachment.fileSize
              ? `${Math.round(Number(attachment.fileSize) / 1024)}KB`
              : "Unknown",
            url: attachment.fileUrl || attachment.fileData,
            type: attachment.type?.split("/")[0] || "other",
          });
        });
      }
    });

    console.log("Extracted file data:", fileData);
    return { messages: formattedMessages, fileData };
  } catch (error) {
    console.error("Error loading messages:", error);
    return { messages: [], fileData: [] };
  }
};

export const processReceivedMessage = async (
  receivedMessage: any,
  currentUser: string,
  currentUserProfilePic?: string,
  userData?: any
): Promise<Message> => {
  // Get proper timestamp
  const createdAt = receivedMessage.createdAt || new Date().toISOString();
  // Format to HH:MM
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const timeDisplay = formatTime(createdAt);

  if (receivedMessage.senderId === currentUser) {
    return {
      id: receivedMessage._id || Date.now().toString(),
      sender: "You",
      content:
        typeof receivedMessage.text === "object"
          ? receivedMessage.text.text || "New message"
          : receivedMessage.text || "New message",
      timestamp: timeDisplay,
      senderId: receivedMessage.senderId,
      chatId: receivedMessage.chatId,
      createdAt: createdAt,
      senderProfilePic: currentUserProfilePic,
      isImage:
        receivedMessage.fileType === "image" ||
        (receivedMessage.attachments &&
          receivedMessage.attachments.some((a: any) =>
            a.type.startsWith("image/")
          )),
      isAudio:
        receivedMessage.fileType === "audio" ||
        (receivedMessage.attachments &&
          receivedMessage.attachments.some((a: any) =>
            a.type.startsWith("audio/")
          )),
      isVideo:
        receivedMessage.fileType === "video" ||
        (receivedMessage.attachments &&
          receivedMessage.attachments.some((a: any) =>
            a.type.startsWith("video/")
          )),
      isFile:
        receivedMessage.fileType === "other" ||
        receivedMessage.fileName ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0),
      fileName:
        receivedMessage.fileName ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? receivedMessage.attachments[0].fileName
          : undefined),
      fileSize: receivedMessage.fileSize
        ? formatFileSize(Number(receivedMessage.fileSize))
        : receivedMessage.attachments && receivedMessage.attachments.length > 0
        ? receivedMessage.attachments[0].fileSize
        : undefined,
      fileUrl:
        receivedMessage.fileUrl ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? receivedMessage.attachments[0].fileUrl
          : undefined),
      fileData:
        receivedMessage.fileData ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? receivedMessage.attachments[0].fileData
          : undefined),
      fileType:
        receivedMessage.fileType ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? (receivedMessage.attachments[0].type.split("/")[0] as
              | "image"
              | "audio"
              | "video"
              | "other"
              | null)
          : null),
    };
  }

  try {
    const { data } = await getUser(receivedMessage.senderId);

    return {
      id: receivedMessage._id || Date.now().toString(),
      sender: data.fullname || data.username || "User",
      content:
        typeof receivedMessage.text === "object"
          ? receivedMessage.text.text || "New message"
          : receivedMessage.text || "New message",
      timestamp: timeDisplay,
      senderId: receivedMessage.senderId,
      chatId: receivedMessage.chatId,
      createdAt: createdAt,
      senderProfilePic: data.profilePic,
      isImage:
        receivedMessage.fileType === "image" ||
        (receivedMessage.attachments &&
          receivedMessage.attachments.some((a: any) =>
            a.type.startsWith("image/")
          )),
      isAudio:
        receivedMessage.fileType === "audio" ||
        (receivedMessage.attachments &&
          receivedMessage.attachments.some((a: any) =>
            a.type.startsWith("audio/")
          )),
      isVideo:
        receivedMessage.fileType === "video" ||
        (receivedMessage.attachments &&
          receivedMessage.attachments.some((a: any) =>
            a.type.startsWith("video/")
          )),
      isFile:
        receivedMessage.fileType === "other" ||
        receivedMessage.fileName ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0),
      fileName:
        receivedMessage.fileName ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? receivedMessage.attachments[0].fileName
          : undefined),
      fileSize: receivedMessage.fileSize
        ? formatFileSize(Number(receivedMessage.fileSize))
        : receivedMessage.attachments && receivedMessage.attachments.length > 0
        ? receivedMessage.attachments[0].fileSize
        : undefined,
      fileUrl:
        receivedMessage.fileUrl ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? receivedMessage.attachments[0].fileUrl
          : undefined),
      fileData:
        receivedMessage.fileData ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? receivedMessage.attachments[0].fileData
          : undefined),
      fileType:
        receivedMessage.fileType ||
        (receivedMessage.attachments && receivedMessage.attachments.length > 0
          ? (receivedMessage.attachments[0].type.split("/")[0] as
              | "image"
              | "audio"
              | "video"
              | "other"
              | null)
          : null),
    };
  } catch (error) {
    console.error("Error fetching sender info:", error);

    return {
      id: receivedMessage._id || Date.now().toString(),
      sender: userData?.fullname || "User",
      content:
        typeof receivedMessage.text === "object"
          ? receivedMessage.text.text || "New message"
          : receivedMessage.text || "New message",
      timestamp: timeDisplay,
      senderId: receivedMessage.senderId,
      chatId: receivedMessage.chatId,
      createdAt: createdAt,
      senderProfilePic: userData?.profilePic,
      isImage: receivedMessage.fileType === "image" || false,
      isAudio: receivedMessage.fileType === "audio" || false,
      isVideo: receivedMessage.fileType === "video" || false,
      isFile:
        receivedMessage.fileType === "other" ||
        receivedMessage.fileName != null,
      fileName: receivedMessage.fileName,
      fileSize: receivedMessage.fileSize
        ? formatFileSize(Number(receivedMessage.fileSize))
        : undefined,
      fileUrl: receivedMessage.fileUrl,
      fileData: receivedMessage.fileData,
      fileType: receivedMessage.fileType || null,
    };
  }
};
