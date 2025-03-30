import { Button } from "@/components/ui/button";
import { LoginForm, PasswordInput, SocialLoginButtons } from ".";
import webLogo from "@assets/images/web-logo.png";
import arrowUp from "@assets/images/arrow-drop-up.png";

interface LoginProps {
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  handleLogin: () => void;
  onToggleForm: () => void;
  errors?: {
    email?: string;
    password?: string;
    fullName?: string;
  };
}

export default function Login({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  rememberMe,
  setRememberMe,
  handleLogin,
  onToggleForm,
  errors = {},
}: LoginProps) {
  return (
    <>
      <div className="flex flex-col items-center max-w-md md:p-10 -mt-5 w-full h-full bg-white overflow-hidden">
        <img src={webLogo} alt="Logo" className="h-40 mb-5" />
        <div className="w-full">
          <LoginForm
            id="email-login"
            type="email"
            label="Username/Email"
            value={loginEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLoginEmail(e.target.value)
            }
          />
          {errors.email && (
            <p className="text-red-500 text-xs ml-2 mb-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        <div className="w-full">
          <PasswordInput value={loginPassword} onChange={setLoginPassword} />
          {errors.password && (
            <p className="text-red-500 text-xs ml-2 mb-1 font-medium">
              {errors.password}
            </p>
          )}
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
                <span className="text-white text-xs font-bold">✔</span>
              )}
            </div>
            <span>Remember me</span>
          </label>
          <a href="#" className="text-sm text-indigo-500 no-underline">
            Forgot password?
          </a>
        </div>
        <Button
          variant="gradientCustom"
          className="flex p-3 mb-1 mt-5 text-lg font-bold text-white w-[152px]"
          onClick={handleLogin}
        >
          Log in
        </Button>
        <p className="mb-3 text-sm text-zinc-700">Or log in with</p>
        <SocialLoginButtons />
      </div>
      <div className="flex justify-center w-full max-w-[300px]">
        <Button
          variant="gradientCustom"
          className="flex flex-col items-center justify-start w-full h-full p-1 text-[12px] text-white rounded-b-none"
          onClick={onToggleForm}
        >
          <div className="flex flex-col -mt-3 items-center">
            <img src={arrowUp} className="h-full w-[50px]" alt="arrowUp" />
            <p className="-mt-1.5">Click here for Register</p>
          </div>
        </Button>
      </div>
    </>
  );
}
