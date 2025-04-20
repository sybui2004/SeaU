interface IComment {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  parentId?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface CommentState {
  comments: { [postId: string]: IComment[] };
  replies: { [commentId: string]: IComment[] };
  loading: boolean;
  error: boolean;
  success: boolean;
}

const initialState: CommentState = {
  comments: {},
  replies: {},
  loading: false,
  error: false,
  success: false,
};

const commentReducer = (state = initialState, action: any): CommentState => {
  switch (action.type) {
    case "COMMENT_LOADING":
      return { ...state, loading: true, error: false, success: false };

    case "COMMENT_GET_SUCCESS":
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.data.postId]: action.data.comments,
        },
        loading: false,
        error: false,
        success: true,
      };

    case "COMMENT_GET_FAIL":
      return { ...state, loading: false, error: true, success: false };

    case "COMMENT_CREATE_SUCCESS":
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.data.postId]: [
            action.data,
            ...(state.comments[action.data.postId] || []),
          ],
        },
        loading: false,
        error: false,
        success: true,
      };

    case "COMMENT_CREATE_FAIL":
      return { ...state, loading: false, error: true, success: false };

    case "COMMENT_UPDATE_SUCCESS":
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.data.postId]: state.comments[action.data.postId].map(
            (comment) =>
              comment._id === action.data._id ? action.data : comment
          ),
        },
        loading: false,
        error: false,
        success: true,
      };

    case "COMMENT_UPDATE_FAIL":
      return { ...state, loading: false, error: true, success: false };

    case "COMMENT_DELETE_SUCCESS":
      const commentId = action.data;
      const postIdToUpdate = Object.keys(state.comments).find((postId) =>
        state.comments[postId].some((comment) => comment._id === commentId)
      );

      return {
        ...state,
        comments: postIdToUpdate
          ? {
              ...state.comments,
              [postIdToUpdate]: state.comments[postIdToUpdate].filter(
                (comment) => comment._id !== commentId
              ),
            }
          : state.comments,
        loading: false,
        error: false,
        success: true,
      };

    case "COMMENT_DELETE_FAIL":
      return { ...state, loading: false, error: true, success: false };

    case "COMMENT_LIKE_SUCCESS":
      const updatedComment = action.data;
      const postId = updatedComment.postId;

      return {
        ...state,
        comments: {
          ...state.comments,
          [postId]:
            state.comments[postId]?.map((comment) =>
              comment._id === updatedComment._id ? updatedComment : comment
            ) || [],
        },
      };

    case "COMMENT_LIKE_FAIL":
      return { ...state, error: true };

    case "COMMENT_REPLIES_LOADING":
      return { ...state, loading: true, error: false, success: false };

    case "COMMENT_REPLIES_SUCCESS":
      return {
        ...state,
        replies: {
          ...state.replies,
          [action.commentId]: action.data,
        },
        loading: false,
        error: false,
        success: true,
      };

    case "COMMENT_REPLIES_FAIL":
      return { ...state, loading: false, error: true, success: false };

    case "COMMENT_REPLY_SUCCESS":
      const parentCommentId = action.commentId;
      const newReply = action.data;

      return {
        ...state,
        replies: {
          ...state.replies,
          [parentCommentId]: [
            newReply,
            ...(state.replies[parentCommentId] || []),
          ],
        },
        loading: false,
        error: false,
        success: true,
      };

    case "COMMENT_REPLY_FAIL":
      return { ...state, loading: false, error: true, success: false };

    default:
      return state;
  }
};

export default commentReducer;
