import NotificationBell from "./NotificationBell";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "@/components/SearchBar";

const Header = () => {
  const { user } = useSelector((state: any) => state.authReducer.authData);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <div className="flex gap-5 pl-4 w-full h-[90px] text-xl whitespace-nowrap bg-white shadow-sm max-md:px-5 max-md:max-w-full sticky top-0 z-1">
      <div className="flex items-center justify-center cursor-pointer">
        <Link
          to="../home"
          className="!font-bold !text-zinc-900 !text-2xl !tracking-tight"
        >
          Home
        </Link>
      </div>
      <div className="flex items-center justify-center w-full max-w-[80%]">
        <SearchBar />
      </div>
      <div className="flex items-center justify-center gap-8">
        <NotificationBell />
        <Link to={`/profile/${user._id}`}>
          <img
            src={
              user.profilePic
                ? serverPublic + user.profilePic
                : serverPublic + "defaultProfile.png"
            }
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;
