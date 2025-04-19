import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import postReducer from "./PostReducer";
import userReducer from "./UserReducer";

export const reducers = combineReducers({
  authReducer,
  postReducer,
  userReducer,
});
