const postReducer = (
  state = {
    posts: [],
    pagination: null,
    loading: false,
    error: false,
    uploading: false,
  },
  action: any
) => {
  switch (action.type) {
    case "UPLOAD_START":
      return { ...state, uploading: true, error: false };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        posts: [
          action.data,
          ...(Array.isArray(state.posts) ? state.posts : []),
        ],
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
          ...(Array.isArray(state.posts) ? state.posts : []),
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
    default:
      return state;
  }
};

export default postReducer;
