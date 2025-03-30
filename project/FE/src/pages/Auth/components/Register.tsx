import { RegisterForm, PasswordInput, SocialLoginButtons } from ".";
import arrowDown from "@assets/images/arrow-drop-down.png";
import { CreateUserRequest } from "@/interfaces/User";
import webLogo from "@assets/images/web-logo.png";

interface RegisterProps {
  fullName: string;
  registerEmail: string;
  registerPassword: string;
  errors: {
    fullName: string;
    email: string;
    password: string;
  };
  handleInputChange: (
    field: keyof CreateUserRequest | "fullName",
    value: string
  ) => void;
  handleRegisterPasswordChange: (value: string) => void;
  handleAddUser: () => void;
  onToggleForm: () => void;
}

function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <p className="text-red-500 text-xs ml-2 font-medium">{message}</p>
  ) : null;
}

export default function Register({
  fullName,
  registerEmail,
  registerPassword,
  errors,
  handleInputChange,
  handleRegisterPasswordChange,
  handleAddUser,
  onToggleForm,
}: RegisterProps) {
  return (
    <div className="flex flex-col items-center max-w-md pt-3 w-full h-full bg-white overflow-hidden">
      <img src={webLogo} alt="Logo" className="h-32 mb-3" />
      <div className="relative flex flex-col items-center justify-center rounded-2xl rounded-b-none w-full h-full p-8 pt-3 bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE] text-white">
        <button
          className="flex flex-col items-center justify-center h-10 text-xl text-white"
          onClick={onToggleForm}
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
            id="fullName"
            type="text"
            label="Full name"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("fullName", e.target.value)
            }
            labelClassName="bg-[#21ADEB]"
          />
          {errors.fullName && <ErrorMessage message={errors.fullName} />}
        </div>

        <div className="w-full">
          <RegisterForm
            id="email-register"
            type="email"
            label="Username/Email"
            value={registerEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("email", e.target.value)
            }
            labelClassName="bg-[#2AB9E8]"
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>

        <div className="w-full">
          <PasswordInput
            variant="register"
            value={registerPassword}
            onChange={handleRegisterPasswordChange}
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>

        <div className="flex flex-col items-center w-full mt-5">
          <button
            className="flex items-center justify-center box-border rounded-full h-9 mb-1 w-[152px] bg-white"
            onClick={handleAddUser}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE] text-lg font-bold">
              Sign Up
            </span>
          </button>
          <p className="text-sm">Or sign up with</p>
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
}
