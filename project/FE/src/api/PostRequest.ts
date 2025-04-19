import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

// User Posts
export const getTimelinePost = (id: string) => API.get(`/post/${id}/timeline`);
export const likePost = (id: string, userId: string) =>
  API.put(`/post/${id}/like`, { userId: userId });

// Friends Posts
export const getFriendTimelinePosts = async (friendIds: string[]) => {
  if (!friendIds || friendIds.length === 0) return [];
  let friendPosts: any[] = [];

  for (const friendId of friendIds) {
    try {
      const response = await API.get(`/post/${friendId}/timeline`);

      friendPosts = [...friendPosts, ...response.data];
    } catch (err) {
      console.error(`Error fetching posts for user ${friendId}:`, err);
    }
  }

  console.log("Total posts fetched:", friendPosts.length);
  return friendPosts;
};
