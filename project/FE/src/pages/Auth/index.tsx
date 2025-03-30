"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { CreateUserRequest, LoginUserRequest } from "@/interfaces/User";

import {
  Login,
  Register,
  ImageSlider,
  SuccessNotification,
} from "./components";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Register form states
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "other",
    profilePic: "default-avatar.png",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    bio: "",
  });

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form validation errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { createUser, loginUser } = useAuthStore();

  const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % 3);

  const handleLogin = async () => {
    // Reset previous errors
    setErrors({
      fullName: "",
      email: "",
      password: "",
    });

    // Basic validation for empty fields
    if (!loginEmail || !loginPassword) {
      setErrors({
        ...errors,
        email: !loginEmail ? "Email is required" : "",
        password: !loginPassword ? "Password is required" : "",
      });
      return;
    }

    try {
      const loginCredentials: LoginUserRequest = {
        email: loginEmail,
        password: loginPassword,
      };

      const response = await loginUser(loginCredentials);

      if (response.success) {
        setSuccessMessage(response.message);
        setShowSuccessNotification(true);

        if (loginEmail.trim().toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // Hiển thị lỗi từ server
        if (response.message.toLowerCase().includes("password")) {
          setErrors({
            ...errors,
            password: response.message,
          });
        } else if (response.message.toLowerCase().includes("user not found")) {
          setErrors({
            ...errors,
            email: response.message,
          });
        } else {
          setErrors({
            ...errors,
            password: response.message || "Login failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        ...errors,
        password: "Connection error. Please try again.",
      });
    }
  };

  const handleToggleForm = () => {
    // Reset errors when switching forms
    setErrors({
      fullName: "",
      email: "",
      password: "",
    });
    // Toggle the form with animation
    setIsLogin(!isLogin);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
    };

    // Basic client-side validation for user experience
    // Chỉ kiểm tra các trường có được nhập hay không
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!registerEmail.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!registerPassword) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddUser = async () => {
    // Kiểm tra cơ bản
    if (!validateForm()) {
      return;
    }

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const userToRegister: CreateUserRequest = {
      ...newUser,
      firstName,
      lastName,
      email: registerEmail,
      password: registerPassword,
    };

    try {
      const response = await createUser(userToRegister);

      if (response.success) {
        setSuccessMessage(response.message);
        setShowSuccessNotification(true);

        setFullName("");
        setRegisterEmail("");
        setRegisterPassword("");

        // Wait before redirecting to login
        setTimeout(() => {
          setIsLogin(true);
        }, 500);
      } else {
        // Xử lý các lỗi cụ thể từ server
        if (response.message.toLowerCase().includes("password")) {
          setErrors({
            ...errors,
            password: response.message,
          });
        } else if (response.message.toLowerCase().includes("email")) {
          setErrors({
            ...errors,
            email: response.message,
          });
        } else if (response.errors) {
          // Xử lý lỗi cho từng trường cụ thể
          const newErrors = { ...errors };

          if (response.errors.firstName || response.errors.lastName) {
            newErrors.fullName = "Full name is required";
          }

          if (response.errors.email) {
            newErrors.email = "Email is required";
          }

          if (response.errors.password) {
            newErrors.password = "Password is required";
          }

          setErrors(newErrors);
        } else {
          setErrors({
            ...errors,
            password:
              response.message || "Registration failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        ...errors,
        password: "Connection error. Please try again.",
      });
    }
  };

  // Update newUser state when inputs change
  const handleInputChange = (
    field: keyof CreateUserRequest | "fullName",
    value: string
  ) => {
    // Clear error for this field when user types
    if (field === "fullName" || field === "email" || field === "password") {
      setErrors({ ...errors, [field]: "" });
    }

    if (field === "fullName") {
      setFullName(value);
      return;
    }

    if (field === "email") {
      setRegisterEmail(value);
    }

    if (field === "password") {
      setRegisterPassword(value);
    }

    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegisterPasswordChange = (value: string) => {
    setRegisterPassword(value);
    handleInputChange("password", value);
  };

  const closeSuccessNotification = () => {
    setShowSuccessNotification(false);
  };

  return (
    <section className="flex justify-center items-center p-10 h-screen w-screen bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE]">
      {showSuccessNotification && (
        <SuccessNotification
          message={successMessage}
          onClose={closeSuccessNotification}
        />
      )}

      <article className="flex bg-white rounded-3xl max-w-[1200px] shadow-lg flex-wrap md:flex-nowrap h-full w-[85%] overflow-hidden">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap md:flex-nowrap w-full h-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 h-full overflow-hidden">
                <Login
                  loginEmail={loginEmail}
                  setLoginEmail={setLoginEmail}
                  loginPassword={loginPassword}
                  setLoginPassword={setLoginPassword}
                  rememberMe={rememberMe}
                  setRememberMe={setRememberMe}
                  handleLogin={handleLogin}
                  onToggleForm={handleToggleForm}
                  errors={errors}
                />
              </div>
              <div className="hidden md:block w-full md:w-1/2 h-full">
                <ImageSlider
                  currentImageIndex={currentImageIndex}
                  handleNextImage={handleNextImage}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap md:flex-nowrap w-full h-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 h-full overflow-hidden">
                <Register
                  fullName={fullName}
                  registerEmail={registerEmail}
                  registerPassword={registerPassword}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleRegisterPasswordChange={handleRegisterPasswordChange}
                  handleAddUser={handleAddUser}
                  onToggleForm={handleToggleForm}
                />
              </div>
              <div className="hidden md:block w-full md:w-1/2 h-full">
                <ImageSlider
                  currentImageIndex={currentImageIndex}
                  handleNextImage={handleNextImage}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </section>
  );
}

export default AuthForm;
