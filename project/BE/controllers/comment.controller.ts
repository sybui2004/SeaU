import Comment from "../models/comment.model";
import Post from "../models/post.model";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";

// Get comments by post id
export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalComments = await Comment.countDocuments({
      postId,
      parentId: null,
    });
    const totalPages = Math.ceil(totalComments / limit);

    const comments = await Comment.find({ postId, parentId: null })
      .populate("userId", "fullname profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return responseUtils.success(res, {
      success: true,
      message: "Comments fetched successfully",
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalComments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    return responseUtils.error(res, "Error retrieving comments", 500);
  }
};

// Create a comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, userId, content } = req.body;

    if (!postId || !userId || !content?.trim()) {
      return responseUtils.error(res, "Missing required fields", 400);
    }

    const post = await Post.findById(postId);
    if (!post) {
      return responseUtils.error(res, "Post not found", 404);
    }

    const newComment = new Comment({
      postId,
      userId,
      content,
      likes: [],
      parentId: null,
    });

    const savedComment = await newComment.save();

    const populatedComment = await Comment.findById(savedComment._id).populate(
      "userId",
      "fullname profilePic"
    );
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    return responseUtils.success(res, {
      success: true,
      message: "Comment created successfully",
      data: populatedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return responseUtils.error(res, "Error creating comment", 500);
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const { content, userId, currentUserAdminStatus } = req.body;

    if (!content?.trim()) {
      return responseUtils.error(res, "Comment content cannot be empty", 400);
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return responseUtils.error(res, "Comment not found", 404);
    }

    if (comment.userId.toString() !== userId && !currentUserAdminStatus) {
      return responseUtils.error(
        res,
        "You don't have permission to edit this comment",
        403
      );
    }

    comment.content = content;
    comment.isEdited = true;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(
      updatedComment._id
    ).populate("userId", "fullname profilePic");

    return responseUtils.success(res, {
      success: true,
      message: "Comment updated successfully",
      data: populatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return responseUtils.error(res, "Error updating comment", 500);
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const { userId, currentUserAdminStatus } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return responseUtils.error(res, "Comment not found", 404);
    }

    if (comment.userId.toString() !== userId && !currentUserAdminStatus) {
      return responseUtils.error(
        res,
        "You don't have permission to delete this comment",
        403
      );
    }

    await Comment.deleteMany({ parentId: commentId });

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: commentId },
    });

    return responseUtils.success(res, {
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return responseUtils.error(res, "Error deleting comment", 500);
  }
};

// Like a comment
export const likeComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return responseUtils.error(res, "Comment not found", 404);
    }

    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    const updatedComment = await comment.save();
    const populatedComment = await Comment.findById(
      updatedComment._id
    ).populate("userId", "fullname profilePic");

    const action = likeIndex === -1 ? "liked" : "unliked";
    return responseUtils.success(res, {
      success: true,
      message: `Comment ${action} successfully`,
      data: populatedComment,
    });
  } catch (error) {
    console.error("Error liking/unliking comment:", error);
    return responseUtils.error(res, "Error liking/unliking comment", 500);
  }
};

// Get replies by comment id
export const getRepliesByCommentId = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalReplies = await Comment.countDocuments({ parentId: commentId });
    const totalPages = Math.ceil(totalReplies / limit);

    const replies = await Comment.find({ parentId: commentId })
      .populate("userId", "fullname profilePic")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    return responseUtils.success(res, {
      success: true,
      message: "Replies fetched successfully",
      data: {
        replies,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalReplies,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving replies:", error);
    return responseUtils.error(res, "Error retrieving replies", 500);
  }
};

// Create a reply
export const createReply = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const { userId, content, postId } = req.body;

  if (!userId || !content?.trim() || !postId) {
    return responseUtils.error(res, "Missing required fields", 400);
  }

  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return responseUtils.error(res, "Parent comment not found", 404);
    }

    const newReply = new Comment({
      postId,
      userId,
      content,
      likes: [],
      parentId: commentId,
    });

    const savedReply = await newReply.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedReply._id },
    });

    const populatedReply = await Comment.findById(savedReply._id).populate(
      "userId",
      "fullname profilePic"
    );

    return responseUtils.success(res, {
      success: true,
      message: "Reply created successfully",
      data: populatedReply,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    return responseUtils.error(res, "Error creating reply", 500);
  }
};
