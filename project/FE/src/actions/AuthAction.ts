import * as AuthApi from "../api/AuthRequest";
import { FormData } from "../api/AuthRequest";
import { Dispatch } from "redux";

export const logIn = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const signUp = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  dispatch({ type: "LOG_OUT" });
  localStorage.clear();
};
