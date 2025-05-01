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
  userProfiles: {},
  userFriends: {},
  loading: false,
  error: false,
};

const UserReducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default UserReducer;
