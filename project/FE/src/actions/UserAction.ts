import * as UserApi from "../api/UserRequest";

export const getUserProfile = (userId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: "USER_PROFILE_LOADING" });
    try {
      const { data } = await UserApi.getUser(userId);
      dispatch({ type: "USER_PROFILE_SUCCESS", data: data });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      dispatch({ type: "USER_PROFILE_FAIL" });
    }
  };
};

export const updateUser = (id: string, formData: any) => {
  return async (dispatch: any) => {
    dispatch({ type: "UPDATING_START" });
    try {
      const { data } = await UserApi.updateUser(id, formData);
      dispatch({ type: "UPDATING_SUCCESS", data: data });
    } catch (error) {
      dispatch({ type: "UPDATING_FAIL" });
    }
  };
};

// // Action lấy danh sách bạn bè
// export const getUserFriends = (userId: string) => {
//   return async (dispatch: any) => {
//     dispatch({ type: "USER_FRIENDS_LOADING" });
//     try {
//       const { data } = await UserApi.getUserFriends(userId);
//       dispatch({ type: "USER_FRIENDS_SUCCESS", data: data });
//     } catch (error) {
//       console.error("Error fetching user friends:", error);
//       dispatch({ type: "USER_FRIENDS_FAIL" });
//     }
//   };
// };

// Action theo dõi/kết bạn với người dùng
// export const followUser = (followUserId: string, currentUserId: string) => {
//   return async (dispatch: any) => {
//     try {
//       await UserApi.followUser(followUserId, currentUserId);
//       dispatch({ type: "FOLLOW_USER", data: followUserId });
//     } catch (error) {
//       console.error("Error following user:", error);
//     }
//   };
// };

// // Action hủy theo dõi/hủy kết bạn
// export const unfollowUser = (unfollowUserId: string, currentUserId: string) => {
//   return async (dispatch: any) => {
//     try {
//       await UserApi.unfollowUser(unfollowUserId, currentUserId);
//       dispatch({ type: "UNFOLLOW_USER", data: unfollowUserId });
//     } catch (error) {
//       console.error("Error unfollowing user:", error);
//     }
//   };
// };
