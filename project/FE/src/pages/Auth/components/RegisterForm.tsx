"use client";
import * as React from "react";

type RegisterFormProps = {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  labelClassName?: string;
};

function RegisterForm({
  id,
  type,
  label,
  value,
  onChange,
  rightElement,
  labelClassName,
}: RegisterFormProps) {
  const [focus, setFocus] = React.useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(event.target.value.length > 0);
  };

  return (
    <div className="relative w-full mt-5 rounded-md max-w-[365px] bg-transparent border-2 border-white">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        className={`
            w-full p-4 text-base 
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-0
             [font-family:'Inter-Bold',Helvetica]
            font-bold text-white
            whitespace-nowrap max-w-[365px]
            focus:placeholder-transparent 
            bg-transparent
          `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />
      <div
        className={`
            absolute left-[5px] bg-transparent px-1 z-10 
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
              [font-family:'Inter-Bold',Helvetica] text-white 
              ${
                value || focus
                  ? `text-xs pl-1 pr-1 ${labelClassName || ""}`
                  : `text-base `
              }
            `}
        >
          {label}
        </label>
      </div>
      {rightElement && rightElement}
    </div>
  );
}
export default RegisterForm;
