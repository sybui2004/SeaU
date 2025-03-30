"use client";
import * as React from "react";

type LoginFormProps = {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
};

function LoginForm({
  id,
  type,
  label,
  value,
  onChange,
  rightElement,
}: LoginFormProps) {
  const [focus, setFocus] = React.useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(event.target.value.length > 0);
  };

  return (
    <div
      className={`
        relative mb-2 mt-2 w-full max-w-[365px] 
        ${focus ? "gradient-border-input-focus" : "gradient-border-input"}
      `}
    >
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder=" "
          value={value}
          onChange={onChange}
          className={`
            w-full rounded-md p-4 text-base 
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-0
            bg-white [font-family:'Inter-Bold',Helvetica]
            font-bold text-[#939292]
            whitespace-nowrap max-w-[365px]
            focus:placeholder-transparent 
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={`
            absolute left-[5px] bg-white px-1 z-10 
            transition-all duration-200 ease-in-out
            ${
              value || focus
                ? "top-[-15px] ml-2"
                : "top-1/2 transform -translate-y-1/2 ml-2"
            }
          `}
        >
          <label
            htmlFor={id}
            className={`
              [font-family:'Inter-Bold',Helvetica] 
              ${
                value || focus
                  ? `text-xs text-transparent bg-clip-text bg-gradient-to-b from-[#1ca7ec] to-[#4adee2]`
                  : `text-base text-[#6e7787] `
              }
            `}
          >
            {label}
          </label>
        </div>
        {rightElement && rightElement}
      </div>
    </div>
  );
}
export default LoginForm;
