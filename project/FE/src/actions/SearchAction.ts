import { searchApi } from "@/api/SearchRequest";

export const SEARCH_START = "SEARCH_START";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAIL = "SEARCH_FAIL";
export const LOAD_MORE_SUCCESS = "LOAD_MORE_SUCCESS";
export const SET_SEARCH_TERM = "SET_SEARCH_TERM";
export const CLEAR_SEARCH = "CLEAR_SEARCH";

export const performSearch =
  (query: string, page: number = 1) =>
  async (dispatch: any) => {
    dispatch({ type: SEARCH_START });

    try {
      const results = await searchApi(query, page);

      dispatch({
        type: SEARCH_SUCCESS,
        payload: {
          query,
          results,
          page,
        },
      });

      return results;
    } catch (error) {
      console.error("Search error:", error);
      dispatch({ type: SEARCH_FAIL, payload: error });
      return error;
    }
  };

export const loadMoreResults =
  (query: string, page: number) => async (dispatch: any) => {
    dispatch({ type: SEARCH_START });

    try {
      const results = await searchApi(query, page);

      dispatch({
        type: LOAD_MORE_SUCCESS,
        payload: {
          results,
          page,
        },
      });

      return results;
    } catch (error) {
      console.error("Load more search results error:", error);
      dispatch({ type: SEARCH_FAIL, payload: error });
      return error;
    }
  };

export const setSearchTerm = (query: string) => ({
  type: SET_SEARCH_TERM,
  payload: query,
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});
