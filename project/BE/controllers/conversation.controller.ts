import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";

// Get all conversations of a user
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })
      .populate("members", "fullname profilePic")
      .populate("groupAdmin", "fullname profilePic")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "fullname profilePic",
        },
      })
      .sort({ updatedAt: -1 });

    return responseUtils.success(res, conversations);
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    return responseUtils.error(res, "Error retrieving conversations", 500);
  }
};

// Create a new conversation
export const createConversation = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return responseUtils.error(
      res,
      "Both sender and receiver IDs are required",
      400
    );
  }

  try {
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
      isGroupChat: false,
    });

    if (existingConversation) {
      const conversation = await Conversation.findById(existingConversation._id)
        .populate("members", "fullname profilePic")
        .populate({
          path: "lastMessage",
          populate: {
            path: "senderId",
            select: "fullname profilePic",
          },
        });

      return responseUtils.success(res, {
        message: "Conversation already exists",
        conversation,
      });
    }

    const newConversation = new Conversation({
      members: [senderId, receiverId],
      isGroupChat: false,
    });

    const savedConversation = await newConversation.save();

    const populatedConversation = await Conversation.findById(
      savedConversation._id
    ).populate("members", "fullname profilePic");

    return responseUtils.success(res, {
      message: "Conversation created successfully",
      conversation: populatedConversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return responseUtils.error(res, "Error creating conversation", 500);
  }
};

// Create a group chat
export const createGroupChat = async (req: Request, res: Response) => {
  const { name, members, admin } = req.body;

  if (!name || !members || members.length < 3 || !admin) {
    return responseUtils.error(
      res,
      "Group chat requires at least 3 members including admin",
      400
    );
  }

  try {
    if (!members.includes(admin)) {
      return responseUtils.error(
        res,
        "Admin must be included in members list",
        400
      );
    }

    const newGroupChat = new Conversation({
      isGroupChat: true,
      groupName: name,
      members: members,
      groupAdmin: admin,
    });

    const savedGroupChat = await newGroupChat.save();

    const populatedGroupChat = await Conversation.findById(savedGroupChat._id)
      .populate("members", "fullname profilePic")
      .populate("groupAdmin", "fullname profilePic");

    return responseUtils.success(res, {
      message: "Group chat created successfully",
      groupChat: populatedGroupChat,
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    return responseUtils.error(res, "Error creating group chat", 500);
  }
};

// Delete a conversation
export const deleteConversation = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  const { userId, currentUserAdminStatus } = req.body;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    if (!conversation.members.includes(userId) && !currentUserAdminStatus) {
      return responseUtils.error(
        res,
        "Not authorized to delete this conversation",
        403
      );
    }

    if (
      conversation.isGroupChat &&
      conversation.groupAdmin &&
      conversation.groupAdmin.toString() !== userId
    ) {
      return responseUtils.error(res, "Only admin can delete group chat", 403);
    }

    await Message.deleteMany({ conversationId });

    await Conversation.findByIdAndDelete(conversationId);

    return responseUtils.success(res, {
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return responseUtils.error(res, "Error deleting conversation", 500);
  }
};

// Add a member to a group chat
export const addToGroup = async (req: Request, res: Response) => {
  const { conversationId, userId, adminId } = req.body;

  if (!conversationId || !userId || !adminId) {
    return responseUtils.error(res, "Missing required fields", 400);
  }

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    if (!conversation.isGroupChat) {
      return responseUtils.error(res, "This is not a group chat", 400);
    }

    if (
      !conversation.groupAdmin ||
      conversation.groupAdmin.toString() !== adminId
    ) {
      return responseUtils.error(res, "Only admin can add members", 403);
    }

    if (conversation.members.includes(userId)) {
      return responseUtils.error(res, "User is already in the group", 400);
    }

    conversation.members.push(userId);

    await conversation.save();

    const updatedConversation = await Conversation.findById(conversationId)
      .populate("members", "fullname profilePic")
      .populate("groupAdmin", "fullname profilePic");

    return responseUtils.success(res, {
      message: "User added to group successfully",
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error("Error adding to group:", error);
    return responseUtils.error(res, "Error adding to group", 500);
  }
};

// Remove a member from a group chat
export const removeFromGroup = async (req: Request, res: Response) => {
  const { conversationId, userId, adminId } = req.body;

  if (!conversationId || !userId || !adminId) {
    return responseUtils.error(res, "Missing required fields", 400);
  }

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    if (!conversation.isGroupChat) {
      return responseUtils.error(res, "This is not a group chat", 400);
    }

    if (
      !conversation.groupAdmin ||
      conversation.groupAdmin.toString() !== adminId
    ) {
      return responseUtils.error(res, "Only admin can remove members", 403);
    }

    if (!conversation.members.includes(userId)) {
      return responseUtils.error(res, "User is not in the group", 400);
    }

    if (userId === adminId) {
      return responseUtils.error(res, "Admin cannot be removed", 400);
    }

    conversation.members = conversation.members.filter(
      (member) => member.toString() !== userId
    );

    await conversation.save();

    const updatedConversation = await Conversation.findById(conversationId)
      .populate("members", "fullname profilePic")
      .populate("groupAdmin", "fullname profilePic");

    return responseUtils.success(res, {
      message: "User removed from group successfully",
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error("Error removing from group:", error);
    return responseUtils.error(res, "Error removing from group", 500);
  }
};

// Update conversation information
export const updateConversation = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  const { groupName, groupAvatar, userId } = req.body;

  if (!userId) {
    return responseUtils.error(res, "User ID is required", 400);
  }

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return responseUtils.error(res, "Conversation not found", 404);
    }

    if (!conversation.isGroupChat) {
      return responseUtils.error(
        res,
        "Can only update group chat information",
        400
      );
    }

    if (
      !conversation.groupAdmin ||
      conversation.groupAdmin.toString() !== userId
    ) {
      return responseUtils.error(
        res,
        "Only admin can update group information",
        403
      );
    }

    if (groupName) {
      conversation.groupName = groupName;
    }

    if (groupAvatar) {
      conversation.groupAvatar = groupAvatar;
    }

    const updatedConversation = await conversation.save();

    const populatedConversation = await Conversation.findById(
      updatedConversation._id
    )
      .populate("members", "fullname profilePic")
      .populate("groupAdmin", "fullname profilePic")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "fullname profilePic",
        },
      });

    return responseUtils.success(res, {
      message: "Group chat updated successfully",
      conversation: populatedConversation,
    });
  } catch (error) {
    console.error("Error updating group chat:", error);
    return responseUtils.error(res, "Error updating group chat", 500);
  }
};
