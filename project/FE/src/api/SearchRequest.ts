import API from "./AxiosConfig";

/**
 * Perform a search query with pagination
 * @param query The search term
 * @param page The page number (starts at 1)
 * @returns Search results containing posts and users
 */
export const searchApi = async (query: string, page: number = 1) => {
  try {
    const encoded = encodeURIComponent(query);
    const response = await API.get(`/search?q=${encoded}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Search API error:", error);
    throw error;
  }
};

/**
 * Search for users only
 * @param query The search term
 * @param page The page number (starts at 1)
 * @returns User search results
 */
export const searchUsersApi = async (query: string, page: number = 1) => {
  try {
    const encoded = encodeURIComponent(query);
    const response = await API.get(`/search/users?q=${encoded}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("User search API error:", error);
    throw error;
  }
};

/**
 * Search for posts only
 * @param query The search term
 * @param page The page number (starts at 1)
 * @returns Post search results
 */
export const searchPostsApi = async (query: string, page: number = 1) => {
  try {
    const encoded = encodeURIComponent(query);
    const response = await API.get(`/search/posts?q=${encoded}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Post search API error:", error);
    throw error;
  }
};

export default {
  searchApi,
  searchUsersApi,
  searchPostsApi,
};
