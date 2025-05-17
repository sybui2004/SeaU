import * as PostApi from "../api/PostRequest";

export const getTimelinePost = (
  id: string,
  page: number,
  limit: number,
  isLoadMore = false
) => {
  return async (dispatch: any) => {
    dispatch({
      type: isLoadMore ? "RETREIVING_MORE_START" : "RETREIVING_START",
    });
    try {
      const { data } = await PostApi.getTimelinePosts(id, page, limit);
      dispatch({
        type: isLoadMore ? "RETREIVING_MORE_SUCCESS" : "RETREIVING_SUCCESS",
        data: data,
      });
    } catch (error) {
      dispatch({ type: "RETREIVING_FAIL" });
      console.log(error);
    }
  };
};

export const createPost = (postData: any) => {
  return async (dispatch: any) => {
    dispatch({ type: "UPLOAD_START" });
    try {
      const { data } = await PostApi.createPost(postData);
      dispatch({ type: "UPLOAD_SUCCESS", data: data });
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL" });
      console.log(error);
    }
  };
};

export const likePost = (postId: string, userId: string) => {
  return async (dispatch: any) => {
    try {
      await PostApi.likePost(postId, userId);
      dispatch({ type: "LIKE_POST_SUCCESS", data: postId, userId: userId });
    } catch (error) {
      dispatch({ type: "LIKE_POST_FAIL" });
      console.log(error);
    }
  };
};
