import googleLogo from "@assets/images/google-logo.png";
import facebookLogo from "@assets/images/facebook-logo.png";

const images = {
  googleLogo,
  facebookLogo,
};
function SocialLoginButtons() {
  return (
    <div className="flex gap-5 -mb-1 mt-2">
      <button
        // className="flex justify-center items-center h-10 rounded-2xl border-0 cursor-pointer w-[60px]"
        className={`relative w-[60px] h-10 bg-[#f7caca] 
          rounded-[18px] overflow-hidden 
          border border-solid border-transparent`}
        aria-label="Sign in with Google"
      >
        <img src={images.googleLogo} alt="Google" />
      </button>
      <button
        className={`relative w-[60px] h-10 bg-[#C8D1DF] 
          rounded-[18px] overflow-hidden 
          border border-solid border-transparent`}
        aria-label="Sign in with Facebook"
      >
        <img src={images.facebookLogo} alt="Facebook" />
      </button>
    </div>
  );
}

export default SocialLoginButtons;
