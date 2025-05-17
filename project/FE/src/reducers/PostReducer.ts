interface Post {
  _id: string;
  userId: string;
  content?: string;
  image?: string;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostState {
  posts: Post[];
  pagination: any;
  loading: boolean;
  error: boolean;
  uploading: boolean;
}

const initialState: PostState = {
  posts: [],
  pagination: null,
  loading: false,
  error: false,
  uploading: false,
};

const postReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "UPLOAD_START":
      return { ...state, uploading: true, error: false };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        posts: [action.data, ...state.posts],
        uploading: false,
        error: false,
      };
    case "UPLOAD_FAIL":
      return { ...state, uploading: false, error: true };
    case "RETREIVING_START":
      return { ...state, loading: true, error: false };
    case "RETREIVING_SUCCESS":
      return {
        ...state,
        posts: action.data.posts || action.data,
        pagination: action.data.pagination || null,
        loading: false,
        error: false,
      };
    case "RETREIVING_MORE_START":
      return { ...state, loading: true, error: false };
    case "RETREIVING_MORE_SUCCESS":
      return {
        ...state,
        posts: [
          ...state.posts,
          ...(Array.isArray(action.data.posts)
            ? action.data.posts
            : action.data.posts
            ? action.data.posts
            : []),
        ],
        pagination: action.data.pagination || null,
        loading: false,
        error: false,
      };
    case "RETREIVING_FAIL":
      return { ...state, loading: false, error: true };
    case "LIKE_POST_SUCCESS":
      const postId = action.data;
      const userId = action.userId;

      return {
        ...state,
        posts: state.posts.map((post: Post) => {
          if (post._id === postId) {
            const isLiked = post.likes.includes(userId);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== userId)
                : [...post.likes, userId],
            };
          }
          return post;
        }),
      };
    case "LIKE_POST_FAIL":
      return { ...state, error: true };
    default:
      return state;
  }
};

export default postReducer;
