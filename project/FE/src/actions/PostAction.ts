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
