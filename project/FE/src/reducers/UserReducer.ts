interface UserProfile {
  _id: string;
  fullname: string;
  username: string;
  friends: string[];
  profilePic?: string;
  [key: string]: any;
}

interface UserState {
  userProfiles: Record<string, UserProfile>;
  userFriends: Record<string, any[]>;
  loading: boolean;
  error: boolean;
}

interface UserProfileAction {
  type: "USER_PROFILE_LOADING" | "USER_PROFILE_SUCCESS" | "USER_PROFILE_FAIL";
  data?: UserProfile;
}

// interface UserFriendsAction {
//   type: "USER_FRIENDS_LOADING" | "USER_FRIENDS_SUCCESS" | "USER_FRIENDS_FAIL";
//   userId?: string;
//   data?: any[];
// }

// interface FollowAction {
//   type: "FOLLOW_USER";
//   currentUserId?: string;
//   data?: string;
// }

// interface UnfollowAction {
//   type: "UNFOLLOW_USER";
//   currentUserId?: string;
//   data?: string;
// }

interface UpdateUserAction {
  type: "UPDATE_USER_START" | "UPDATE_USER_SUCCESS" | "UPDATE_USER_FAIL";
  data?: UserProfile;
}

type UserAction =
  | UserProfileAction
  //   | UserFriendsAction
  // | FollowAction
  // | UnfollowAction
  | UpdateUserAction;

const initialState: UserState = {
  userProfiles: {}, // Lưu trữ thông tin người dùng theo ID
  userFriends: {}, // Lưu trữ danh sách bạn bè theo ID người dùng
  loading: false,
  error: false,
};

const UserReducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    // Xử lý lấy thông tin người dùng
    case "USER_PROFILE_LOADING":
      return { ...state, loading: true, error: false };

    case "USER_PROFILE_SUCCESS": {
      if (!action.data || !action.data._id) {
        return state;
      }

      return {
        ...state,
        userProfiles: {
          ...state.userProfiles,
          [action.data._id]: action.data,
        },
        loading: false,
        error: false,
      };
    }

    case "USER_PROFILE_FAIL":
      return { ...state, loading: false, error: true };

    // // Xử lý lấy danh sách bạn bè
    // case "USER_FRIENDS_LOADING":
    //   return { ...state, loading: true, error: false };

    // case "USER_FRIENDS_SUCCESS": {
    //   if (!action.userId) {
    //     return state;
    //   }

    //   return {
    //     ...state,
    //     userFriends: {
    //       ...state.userFriends,
    //       [action.userId]: action.data || [],
    //     },
    //     loading: false,
    //     error: false,
    //   };
    // }

    // case "USER_FRIENDS_FAIL":
    //   return { ...state, loading: false, error: true };

    // Xử lý khi follow/unfollow người dùng
    // case "FOLLOW_USER": {
    //   if (!action.currentUserId || !action.data) {
    //     return state;
    //   }

    //   const currentUser = state.userProfiles[action.currentUserId];
    //   if (!currentUser) {
    //     return state;
    //   }

    //   return {
    //     ...state,
    //     userProfiles: {
    //       ...state.userProfiles,
    //       [action.currentUserId]: {
    //         ...currentUser,
    //         friends: [...currentUser.friends, action.data],
    //       },
    //     },
    //   };
    // }

    // case "UNFOLLOW_USER": {
    //   if (!action.currentUserId || !action.data) {
    //     return state;
    //   }

    //   const currentUser = state.userProfiles[action.currentUserId];
    //   if (!currentUser) {
    //     return state;
    //   }

    //   return {
    //     ...state,
    //     userProfiles: {
    //       ...state.userProfiles,
    //       [action.currentUserId]: {
    //         ...currentUser,
    //         friends: currentUser.friends.filter((id) => id !== action.data),
    //       },
    //     },
    //   };
    // }

    // Xử lý cập nhật thông tin người dùng
    case "UPDATE_USER_START":
      return { ...state, loading: true, error: false };

    case "UPDATE_USER_SUCCESS": {
      if (!action.data || !action.data._id) {
        return state;
      }

      return {
        ...state,
        userProfiles: {
          ...state.userProfiles,
          [action.data._id]: action.data,
        },
        loading: false,
        error: false,
      };
    }

    case "UPDATE_USER_FAIL":
      return { ...state, loading: false, error: true };

    default:
      return state;
  }
};

export default UserReducer;
