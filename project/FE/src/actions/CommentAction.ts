import axios from "axios";

// API service cho comment
const CommentApi = {
  // Lấy tất cả comment của bài post
  getPostComments: async (postId: string) => {
    return await axios.get(`/comment/${postId}`);
  },

  // Tạo comment mới
  createComment: async (postId: string, userId: string, content: string) => {
    return await axios.post(`/comment`, { postId, userId, content });
  },

  // Cập nhật comment
  updateComment: async (commentId: string, userId: string, content: string) => {
    return await axios.put(`/comment/${commentId}`, { userId, content });
  },

  // Xóa comment
  deleteComment: async (commentId: string, userId: string) => {
    return await axios.delete(`/comment/${commentId}`, { data: { userId } });
  },

  // Like/unlike comment
  likeComment: async (commentId: string, userId: string) => {
    return await axios.put(`/comment/${commentId}/like`, { userId });
  },

  // Lấy replies của comment
  getCommentReplies: async (commentId: string) => {
    return await axios.get(`/comment/${commentId}/replies`);
  },

  // Tạo reply cho comment
  createReply: async (
    commentId: string,
    userId: string,
    content: string,
    postId: string
  ) => {
    return await axios.post(`/comment/${commentId}/reply`, {
      userId,
      content,
      postId,
    });
  },
};

// Action lấy tất cả comment của bài post
export const getPostComments = (postId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: "COMMENT_LOADING" });
    try {
      const response = await CommentApi.getPostComments(postId);
      dispatch({ type: "COMMENT_GET_SUCCESS", data: response.data });
    } catch (error) {
      console.error("Error fetching comments:", error);
      dispatch({ type: "COMMENT_GET_FAIL" });
    }
  };
};

// Action tạo comment mới
export const createComment = (
  postId: string,
  userId: string,
  content: string
) => {
  return async (dispatch: any) => {
    dispatch({ type: "COMMENT_LOADING" });
    try {
      const response = await CommentApi.createComment(postId, userId, content);
      dispatch({ type: "COMMENT_CREATE_SUCCESS", data: response.data });
    } catch (error) {
      console.error("Error creating comment:", error);
      dispatch({ type: "COMMENT_CREATE_FAIL" });
    }
  };
};

// Action cập nhật comment
export const updateComment = (
  commentId: string,
  userId: string,
  content: string
) => {
  return async (dispatch: any) => {
    dispatch({ type: "COMMENT_LOADING" });
    try {
      const response = await CommentApi.updateComment(
        commentId,
        userId,
        content
      );
      dispatch({ type: "COMMENT_UPDATE_SUCCESS", data: response.data });
    } catch (error) {
      console.error("Error updating comment:", error);
      dispatch({ type: "COMMENT_UPDATE_FAIL" });
    }
  };
};

// Action xóa comment
export const deleteComment = (commentId: string, userId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: "COMMENT_LOADING" });
    try {
      await CommentApi.deleteComment(commentId, userId);
      dispatch({ type: "COMMENT_DELETE_SUCCESS", data: commentId });
    } catch (error) {
      console.error("Error deleting comment:", error);
      dispatch({ type: "COMMENT_DELETE_FAIL" });
    }
  };
};

// Action like/unlike comment
export const likeComment = (commentId: string, userId: string) => {
  return async (dispatch: any) => {
    try {
      const response = await CommentApi.likeComment(commentId, userId);
      dispatch({ type: "COMMENT_LIKE_SUCCESS", data: response.data });
    } catch (error) {
      console.error("Error liking comment:", error);
      dispatch({ type: "COMMENT_LIKE_FAIL" });
    }
  };
};

// Action lấy replies của comment
export const getCommentReplies = (commentId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: "COMMENT_REPLIES_LOADING" });
    try {
      const response = await CommentApi.getCommentReplies(commentId);
      dispatch({
        type: "COMMENT_REPLIES_SUCCESS",
        data: response.data,
        commentId,
      });
    } catch (error) {
      console.error("Error fetching comment replies:", error);
      dispatch({ type: "COMMENT_REPLIES_FAIL" });
    }
  };
};

// Action tạo reply cho comment
export const createReply = (
  commentId: string,
  userId: string,
  content: string,
  postId: string
) => {
  return async (dispatch: any) => {
    dispatch({ type: "COMMENT_LOADING" });
    try {
      const response = await CommentApi.createReply(
        commentId,
        userId,
        content,
        postId
      );
      dispatch({
        type: "COMMENT_REPLY_SUCCESS",
        data: response.data,
        commentId,
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      dispatch({ type: "COMMENT_REPLY_FAIL" });
    }
  };
};
