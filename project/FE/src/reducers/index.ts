import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import postReducer from "./PostReducer";
import userReducer from "./UserReducer";
import commentReducer from "./commentReducer";

export const reducers = combineReducers({
  authReducer,
  postReducer,
  userReducer,
  commentReducer,
});
