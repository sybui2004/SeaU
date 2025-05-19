// AuthForm.tsx
"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ImageSlider,
  LoginForm,
  PasswordInput,
  RegisterForm,
} from "./components";
import { Button } from "@/components/ui/button";
import webLogo from "@assets/images/web-logo.png";
import arrowUp from "@assets/images/arrow-drop-up.png";
import arrowDown from "@assets/images/arrow-drop-down.png";
import { logIn, signUp } from "@/actions/AuthAction";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleNextImage = () => setCurrentImageIndex((i) => (i + 1) % 3);
  const [data, setData] = useState({
    fullname: "",
    username: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (isLogin) {
      dispatch(logIn(data) as any);
    } else {
      dispatch(signUp(data) as any);
    }
  };
  const resetForm = () => {
    setData({
      fullname: "",
      username: "",
      password: "",
    });
  };
  return (
    <section className="flex justify-center items-center p-10 h-screen w-screen bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE]">
      {/* {auth.showSuccessNotification && (
        <SuccessNotification
        // message={successMessage}
        // onClose={() => setShowSuccessNotification(false)}
        />
      )} */}

      <form className="flex bg-white rounded-3xl max-w-[1200px] shadow-lg flex-wrap md:flex-nowrap h-full w-[85%] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap md:flex-nowrap w-full h-full"
          >
            <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 h-full overflow-hidden">
              {isLogin ? (
                <>
                  <div className="flex flex-col items-center max-w-md md:p-10 -mt-5 w-full h-full bg-white overflow-hidden">
                    <img src={webLogo} alt="Logo" className="h-40 mb-5" />
                    <div className="w-full">
                      <LoginForm
                        id="username-login"
                        name="username"
                        type="text"
                        label="Username"
                        value={data.username}
                        onChange={handleChange}
                      />
                      {/* {errors.username && (
                        <p className="text-red-500 text-xs ml-2 mb-1 font-medium">
                          {errors.username}
                        </p>
                      )} */}
                    </div>

                    <div className="w-full">
                      <PasswordInput
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                      />
                      {/* {errors.password && (
                        <p className="text-red-500 text-xs ml-2 mb-1 font-medium">
                          {errors.password}
                        </p>
                      )} */}
                    </div>

                    <div className="flex justify-between items-center w-full mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="peer hidden"
                        />
                        <div className="w-5 h-5 rounded border-2 border-gray-500 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 flex items-center justify-center transition-all">
                          {rememberMe && (
                            <span className="text-white text-xs font-bold">
                              ✔
                            </span>
                          )}
                        </div>
                        <span>Remember me</span>
                      </label>
                      <a
                        href="#"
                        className="text-sm text-indigo-500 no-underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Button
                      variant="gradientCustom"
                      className="flex p-3 mb-1 mt-5 text-lg font-bold text-white w-[152px]"
                      onClick={handleSubmit}
                    >
                      Log in
                    </Button>
                  </div>
                  <div className="flex justify-center w-full max-w-[300px]">
                    <Button
                      variant="gradientCustom"
                      className="flex flex-col items-center justify-start w-full h-full p-1 text-[12px] text-white rounded-b-none"
                      onClick={() => {
                        setIsLogin((prev) => !prev);
                        resetForm();
                      }}
                    >
                      <div className="flex flex-col -mt-3 items-center">
                        <img
                          src={arrowUp}
                          className="h-full w-[50px]"
                          alt="arrowUp"
                        />
                        <p className="-mt-1.5">Click here for Register</p>
                      </div>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center max-w-md pt-3 w-full h-full bg-white overflow-hidden">
                  <img src={webLogo} alt="Logo" className="h-32 mb-3" />
                  <div className="relative flex flex-col items-center justify-center rounded-2xl rounded-b-none w-full h-full p-8 pt-3 bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE] text-white">
                    <button
                      className="flex flex-col items-center justify-center h-10 text-xl text-white"
                      onClick={() => {
                        setIsLogin((prev) => !prev);
                        resetForm();
                      }}
                    >
                      <p className="">Log in</p>
                      <img
                        src={arrowDown}
                        className="h-auto w-[50px] -mt-2"
                        alt="arrowDown"
                      />
                    </button>

                    <div className="w-full">
                      <RegisterForm
                        id="fullname"
                        type="text"
                        label="Full name"
                        name="fullname"
                        value={data.fullname}
                        onChange={handleChange}
                        labelClassName="bg-[#21ADEB]"
                      />
                      {/* {errors.fullname && (
                        <ErrorMessage message={errors.fullname} />
                      )} */}
                    </div>

                    <div className="w-full">
                      <RegisterForm
                        id="username-register"
                        type="text"
                        label="Username"
                        name="username"
                        value={data.username}
                        onChange={handleChange}
                        labelClassName="bg-[#2AB9E8]"
                      />
                      {/* {errors.username && (
                        <ErrorMessage message={errors.username} />
                      )} */}
                    </div>

                    <div className="w-full">
                      <PasswordInput
                        variant="register"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                      />
                      {/* {errors.password && (
                        <ErrorMessage message={errors.password} />
                      )} */}
                    </div>

                    <div className="flex flex-col items-center w-full mt-5">
                      <button
                        className="flex items-center justify-center box-border rounded-full h-9 mb-1 w-[152px] bg-white"
                        onClick={handleSubmit}
                      >
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE] text-lg font-bold">
                          Sign Up
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block w-full md:w-1/2 h-full">
              <ImageSlider
                currentImageIndex={currentImageIndex}
                handleNextImage={handleNextImage}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </section>
  );
}

export default AuthForm;
