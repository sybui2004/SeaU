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

interface FriendAction {
  type:
    | "SEND_FRIEND_REQUEST"
    | "CANCEL_FRIEND_REQUEST"
    | "ACCEPT_FRIEND_REQUEST"
    | "REJECT_FRIEND_REQUEST"
    | "UNFRIEND_USER";
  data?: string;
  currentUserId?: string;
}

type UserAction = UserProfileAction | FriendAction;

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

    // Xử lý các actions về friend requests
    case "SEND_FRIEND_REQUEST":
    case "CANCEL_FRIEND_REQUEST":
    case "ACCEPT_FRIEND_REQUEST":
    case "REJECT_FRIEND_REQUEST":
    case "UNFRIEND_USER":
      // Chỉ log action mà không thay đổi state, vì chúng ta sử dụng API trực tiếp để lấy dữ liệu
      console.log(`Friend action: ${action.type}`, action.data);
      return state;

    default:
      return state;
  }
};

export default UserReducer;
