import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import User from "../models/user.model";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";

// Get messages
export const getMessages = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    const totalMessages = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "fullname profilePic");

    return responseUtils.success(res, {
      messages: messages.reverse(),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return responseUtils.error(res, "Error retrieving messages", 500);
  }
};

// Get all messages in the system for admin
export const getAllMessagesSystem = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    const searchQuery: any = {};
    if (search) {
      searchQuery.text = { $regex: search, $options: "i" };
    }

    const totalMessages = await Message.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await Message.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "fullname profilePic username")
      .populate("conversationId", "name isGroup members");

    const enhancedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageObj = message.toObject();

        if (!messageObj.conversationId) {
          return messageObj;
        }

        const conversationId = messageObj.conversationId as any;

        if (!conversationId.isGroup) {
          const otherMemberId = conversationId.members.find(
            (memberId: string) =>
              memberId.toString() !== messageObj.senderId._id.toString()
          );

          if (otherMemberId) {
            const otherUser = await User.findById(otherMemberId, "fullname");
            if (otherUser) {
              (messageObj as any).receiver = {
                _id: otherMemberId,
                fullname: otherUser.fullname,
              };
            }
          }
        }

        return messageObj;
      })
    );

    return responseUtils.success(res, {
      messages: enhancedMessages,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving all messages for admin:", error);
    return responseUtils.error(res, "Error retrieving messages", 500);
  }
};

// Get all messages for admin for a specific conversation
export const getAllMessagesForAdmin = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    const searchQuery: any = {
      conversationId: conversationId,
    };

    if (search) {
      searchQuery.text = { $regex: search, $options: "i" };
    }

    const totalMessages = await Message.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await Message.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "fullname profilePic username")
      .populate("conversationId");

    return responseUtils.success(res, {
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving messages for admin:", error);
    return responseUtils.error(res, "Error retrieving messages", 500);
  }
};

// Create message
export const createMessage = async (req: Request, res: Response) => {
  const {
    conversationId,
    senderId,
    text,
    fileType,
    fileData,
    fileName,
    fileSize,
  } = req.body;

  if (!conversationId || !senderId) {
    return responseUtils.error(res, "Missing required fields", 400);
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    if (!conversation.members.includes(senderId)) {
      return responseUtils.error(
        res,
        "User is not a member of this conversation",
        403
      );
    }

    // Tạo message object với các trường cơ bản
    const newMessage: any = {
      conversationId,
      senderId,
      text: text || "",
      isDeleted: false,
    };

    // Thêm thông tin file nếu có
    if (fileType) {
      newMessage.fileType = fileType;
      newMessage.fileData = fileData;
      newMessage.fileName = fileName;
      newMessage.fileSize = fileSize;
    }

    const message = new Message(newMessage);
    const savedMessage = await message.save();

    // Cập nhật lastMessage cho conversation
    conversation.lastMessage = savedMessage._id;
    await conversation.save();

    // Trả về message đã populated với thông tin người gửi
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      "senderId",
      "fullname profilePic"
    );

    return responseUtils.success(res, populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return responseUtils.error(res, "Error sending message", 500);
  }
};

// Đặt alias cho createMessage để hỗ trợ API cũ
export const addMessage = createMessage;

// Update message
export const updateMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { userId, text, fileData, fileType, fileName, fileSize, isAdmin } =
    req.body;

  if (!userId) {
    return responseUtils.error(res, "User ID is required", 400);
  }

  if (!text && !fileData) {
    return responseUtils.error(res, "Message content cannot be empty", 400);
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return responseUtils.error(res, "Message not found", 404);
    }

    if (message.senderId.toString() !== userId && !isAdmin) {
      return responseUtils.error(
        res,
        "Not authorized to update this message",
        403
      );
    }

    if (message.isDeleted) {
      return responseUtils.error(res, "Cannot update deleted message", 400);
    }

    if (text) {
      message.text = text;
    }

    if (fileData) {
      message.fileData = fileData;
      message.fileType = fileType || "other";
      message.fileName = fileName;
      message.fileSize = fileSize;
    }

    if (!isAdmin || req.body.markAsEdited) {
      message.isEdited = true;
    }

    const updatedMessage = await message.save();

    const populatedMessage = await Message.findById(
      updatedMessage._id
    ).populate("senderId", "fullname profilePic");

    return responseUtils.success(res, {
      message: "Message updated successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return responseUtils.error(res, "Error updating message", 500);
  }
};

// Update message as admin
export const updateMessageAsAdmin = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const {
    text,
    fileData,
    fileType,
    fileName,
    fileSize,
    markAsEdited = false,
  } = req.body;

  if (!text && !fileData) {
    return responseUtils.error(res, "Message content cannot be empty", 400);
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return responseUtils.error(res, "Message not found", 404);
    }

    if (message.isDeleted) {
      return responseUtils.error(res, "Cannot update deleted message", 400);
    }

    if (text) {
      message.text = text;
    }

    if (fileData) {
      message.fileData = fileData;
      message.fileType = fileType || "other";
      message.fileName = fileName;
      message.fileSize = fileSize;
    }

    if (markAsEdited) {
      message.isEdited = true;
    }

    const updatedMessage = await message.save();

    const populatedMessage = await Message.findById(
      updatedMessage._id
    ).populate("senderId", "fullname profilePic");

    return responseUtils.success(res, {
      message: "Message updated successfully by admin",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Error updating message as admin:", error);
    return responseUtils.error(res, "Error updating message", 500);
  }
};

// Delete message
export const deleteMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { userId, isAdmin } = req.body;

  if (!userId) {
    return responseUtils.error(res, "User ID is required", 400);
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return responseUtils.error(res, "Message not found", 404);
    }
    if (message.senderId.toString() !== userId && !isAdmin) {
      return responseUtils.error(
        res,
        "Not authorized to delete this message",
        403
      );
    }

    message.isDeleted = true;
    message.text = "This message has been deleted";
    message.fileData = null;
    message.fileType = null;
    message.fileName = null;
    message.fileSize = null;

    await message.save();

    return responseUtils.success(res, {
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return responseUtils.error(res, "Error deleting message", 500);
  }
};

// Delete message as admin
export const deleteMessageAsAdmin = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return responseUtils.error(res, "Message not found", 404);
    }

    message.isDeleted = true;
    message.text = "This message has been deleted by an administrator";
    message.fileData = null;
    message.fileType = null;
    message.fileName = null;
    message.fileSize = null;

    await message.save();

    return responseUtils.success(res, {
      message: "Message deleted successfully by admin",
    });
  } catch (error) {
    console.error("Error deleting message as admin:", error);
    return responseUtils.error(res, "Error deleting message", 500);
  }
};

// Get all messages by user id
export const getMessagesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return responseUtils.error(res, "User not found", 404);
    }

    // Tìm tất cả cuộc trò chuyện mà người dùng tham gia
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    const conversationIds = conversations.map((conv) => conv._id);

    // Tìm tin nhắn trong các cuộc trò chuyện này hoặc tin nhắn do người dùng gửi
    const query = {
      $or: [{ conversationId: { $in: conversationIds } }, { senderId: userId }],
      isDeleted: false,
    };

    const totalMessages = await Message.countDocuments(query);
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "fullname profilePic username")
      .populate("conversationId", "members isGroup groupName");

    // Tạo metadata cho mỗi tin nhắn
    const enhancedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageObj: any = message.toObject();

        // Thêm thông tin xem tin nhắn này là gửi đi hay nhận về
        messageObj.isSent = message.senderId._id.toString() === userId;

        // Thêm thông tin người gửi/nhận nếu là tin nhắn trực tiếp
        if (messageObj.conversationId) {
          const conversation = messageObj.conversationId as any;
          if (!conversation.isGroup && Array.isArray(conversation.members)) {
            const otherMemberId = conversation.members.find(
              (memberId: string) => memberId.toString() !== userId
            );

            if (otherMemberId) {
              const otherUser = await User.findById(
                otherMemberId,
                "fullname profilePic"
              );
              if (otherUser) {
                messageObj.otherUser = {
                  _id: otherMemberId,
                  fullname: otherUser.fullname,
                  profilePic: otherUser.profilePic,
                };
              }
            }
          }
        }

        return messageObj;
      })
    );

    return responseUtils.success(res, {
      messages: enhancedMessages,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving messages by user ID:", error);
    return responseUtils.error(res, "Error retrieving messages", 500);
  }
};
