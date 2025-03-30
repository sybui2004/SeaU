import { FC } from "react";
import { useNavigate } from "react-router-dom";
import AdminNotificationBell from "./AdminNotificationBell";
import ava from "@assets/images/ava.png";

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white shadow-sm">
      <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <AdminNotificationBell />

        <div className="flex items-center space-x-2">
          <img src={ava} alt="Admin" className="w-8 h-8 rounded-full" />
          <span className="font-medium">Admin</span>
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
