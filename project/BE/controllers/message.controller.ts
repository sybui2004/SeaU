import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";

// Get messages
export const getMessages = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;
    const { page = 1, limit = 20 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate("senderId", "fullname profilePic");

    const totalMessages = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    return responseUtils.success(res, {
      messages: messages.reverse(),
      totalPages: Math.ceil(totalMessages / parseInt(limit as string)),
      currentPage: parseInt(page as string),
      totalMessages,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return responseUtils.error(res, "Error retrieving messages", 500);
  }
};

// Create message
export const createMessage = async (req: Request, res: Response) => {
  const { conversationId, senderId, text, attachments } = req.body;

  if (
    !conversationId ||
    !senderId ||
    (!text && (!attachments || attachments.length === 0))
  ) {
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

    const newMessage = new Message({
      conversationId,
      senderId,
      text: text || "",
      attachments: attachments || [],
    });

    const savedMessage = await newMessage.save();

    conversation.lastMessage = savedMessage._id;
    await conversation.save();

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

// Update message
export const updateMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { userId, text, attachments } = req.body;

  if (!userId) {
    return responseUtils.error(res, "User ID is required", 400);
  }

  if (!text && (!attachments || attachments.length === 0)) {
    return responseUtils.error(res, "Message content cannot be empty", 400);
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return responseUtils.error(res, "Message not found", 404);
    }

    if (message.senderId.toString() !== userId) {
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

    if (attachments && attachments.length > 0) {
      message.attachments = attachments;
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

// Delete message
export const deleteMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const { userId, currentUserAdminStatus } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return responseUtils.error(res, "Message not found", 404);
    }

    if (message.senderId.toString() !== userId && !currentUserAdminStatus) {
      return responseUtils.error(
        res,
        "Not authorized to delete this message",
        403
      );
    }

    message.isDeleted = true;
    message.text = "This message has been deleted";
    message.attachments = [];

    await message.save();

    return responseUtils.success(res, {
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return responseUtils.error(res, "Error deleting message", 500);
  }
};
