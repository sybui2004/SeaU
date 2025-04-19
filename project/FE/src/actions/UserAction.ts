import * as UserApi from "../api/UserRequest";

// Action lấy thông tin người dùng theo ID
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

// Action cập nhật thông tin người dùng
export const updateUser = (id: string, formData: any) => {
  return async (dispatch: any) => {
    dispatch({ type: "UPDATE_USER_START" });
    try {
      console.log("UserAction: Preparing to update user", { id });

      const { data } = await UserApi.updateUser(id, formData);
      dispatch({ type: "UPDATE_USER_SUCCESS", data: data });

      // Cập nhật thông tin người dùng trong localStorage nếu cần
      try {
        const profile = JSON.parse(localStorage.getItem("profile") || "{}");
        if (profile.user && profile.user._id === id) {
          profile.user = { ...profile.user, ...data };
          localStorage.setItem("profile", JSON.stringify(profile));
        }
      } catch (e) {
        console.error("Error updating local storage:", e);
      }

      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      dispatch({ type: "UPDATE_USER_FAIL" });
      throw error;
    }
  };
};
