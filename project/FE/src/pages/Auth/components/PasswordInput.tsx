"use client";
import * as React from "react";
import hideLogin from "@assets/images/hide-login.png";
import showLogin from "@assets/images/show-login.png";
import hideRegister from "@assets/images/hide-register.png";
import showRegister from "@assets/images/show-register.png";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
type PasswordInputProps = {
  variant?: "login" | "register";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  id?: string;
  label?: string;
  name?: string;
};

function PasswordInput({
  variant = "login",
  value,
  onChange,
  id = "password",
  label = "Password",
  name = "password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputProps = {
    id,
    name,
    type: showPassword ? "text" : "password",
    label,
    value,
    onChange,
    rightElement: (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className={`w-10 h-10 rounded-md absolute top-2/4 
        -translate-y-2/4 cursor-pointer right-[15px]
        flex items-center justify-center`}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <img
          src={
            showPassword
              ? variant === "login"
                ? hideLogin
                : hideRegister
              : variant === "login"
              ? showLogin
              : showRegister
          }
          className="w-5 h-5 max-w-none"
          alt={showPassword ? "Hide password" : "Show password"}
        />
      </button>
    ),
    autoComplete: "new-password",
  };

  if (variant === "login") {
    return <LoginForm {...inputProps} />;
  } else {
    return <RegisterForm {...inputProps} labelClassName="bg-[#33C3E6]" />;
  }
}

export default PasswordInput;
