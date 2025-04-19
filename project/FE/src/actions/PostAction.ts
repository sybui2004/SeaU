import * as PostApi from "../api/PostRequest";

export const getTimelinePost = (id: string) => {
  return async (dispatch: any) => {
    dispatch({ type: "RETREIVING_START" });
    try {
      const { data } = await PostApi.getTimelinePost(id);
      dispatch({ type: "RETREIVING_SUCCESS", data: data });
    } catch (error) {
      dispatch({ type: "RETREIVING_FAIL" });
      console.log(error);
    }
  };
};

export const likePost = (postId: string, userId: string) => {
  return async (dispatch: any) => {
    try {
      await PostApi.likePost(postId, userId);
      dispatch({ type: "LIKE_POST_SUCCESS", data: postId });
    } catch (error) {
      dispatch({ type: "LIKE_POST_FAIL" });
      console.log(error);
    }
  };
};

// export const getAllFriendsAndUserPosts = (
//   userId: string,
//   friendIds: string[]
// ) => {
//   return async (dispatch: any, getState: any) => {
//     dispatch({ type: "FRIENDS_POSTS_LOADING" });

//     try {
//       // User Posts
//       await dispatch(getTimelinePost(userId));
//       const { posts } = getState().postReducer;

//       if (!friendIds || friendIds.length === 0) {
//         dispatch({
//           type: "FRIENDS_POSTS_SUCCESS",
//           data: posts,
//         });
//         return;
//       }

//       // Friends Posts
//       const friendPosts = await PostApi.getFriendTimelinePosts(friendIds);

//       // Combine posts and sort by time
//       const allPosts = [...posts, ...friendPosts]
//         .filter((post) => post && post.createdAt)
//         .sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );

//       dispatch({
//         type: "FRIENDS_POSTS_SUCCESS",
//         data: allPosts,
//       });
//     } catch (error) {
//       dispatch({ type: "FRIENDS_POSTS_FAIL" });
//     }
//   };
// };
