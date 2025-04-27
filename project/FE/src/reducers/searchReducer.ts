import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAIL,
  LOAD_MORE_SUCCESS,
  SET_SEARCH_TERM,
  CLEAR_SEARCH,
} from "../actions/SearchAction";

interface SearchState {
  loading: boolean;
  error: any;
  searchTerm: string;
  posts: any[];
  users: any[];
  currentPage: number;
  hasMore: boolean;
}

const initialState: SearchState = {
  loading: false,
  error: null,
  searchTerm: "",
  posts: [],
  users: [],
  currentPage: 1,
  hasMore: true,
};

const searchReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SEARCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        searchTerm: action.payload.query || state.searchTerm,
        posts: action.payload.results?.posts || [],
        users: action.payload.results?.users || [],
        currentPage: action.payload.page,
        hasMore:
          action.payload.results?.posts?.length > 0 ||
          action.payload.results?.users?.length > 0,
      };

    case LOAD_MORE_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...(action.payload.results?.posts || [])],
        users: [...state.users, ...(action.payload.results?.users || [])],
        currentPage: action.payload.page,
        hasMore:
          action.payload.results?.posts?.length > 0 ||
          action.payload.results?.users?.length > 0,
      };

    case SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case CLEAR_SEARCH:
      return initialState;

    default:
      return state;
  }
};

export default searchReducer;
