import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminNotificationBell from "./AdminNotificationBell";
import { logout } from "@/actions/AuthAction";
import defaultAvatar from "@assets/images/ava.png";

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authData } = useSelector((state: any) => state.authReducer);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/admin/login");
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return defaultAvatar;

    if (imagePath.startsWith("/images/")) {
      return `${serverPublic.replace("/images/", "")}${imagePath}`;
    }

    return `${serverPublic}${imagePath}`;
  };

  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white shadow-sm">
      <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <AdminNotificationBell />

        <div className="flex items-center space-x-2">
          <img
            src={getImageUrl(authData?.user?.profilePic)}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultAvatar;
            }}
          />
          <span className="font-medium">
            {authData?.user?.fullname || "Admin"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-400 text-white rounded-2xl hover:bg-red-500 active:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
