import * as AuthApi from "../api/AuthRequest";

export const logIn = (formData: any) => async (dispatch: any) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const signUp = (formData: any) => async (dispatch: any) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const adminLogIn = (formData: any) => async (dispatch: any) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.adminLogin(formData);
    // Kiểm tra vai trò admin
    if (!data.user.isAdmin) {
      dispatch({ type: "AUTH_FAIL" });
      return;
    }
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const logout = () => async (dispatch: any) => {
  dispatch({ type: "LOG_OUT" });
  localStorage.clear();
};
