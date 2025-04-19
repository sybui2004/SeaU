import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/actions/AuthAction";

import webLogo from "@assets/images/web-logo.png";
import homeIcon from "@assets/images/icon-home.png";
import messageIcon from "@assets/images/icon-message.png";
import botIcon from "@assets/images/icon-bot.png";
import settingIcon from "@assets/images/icon-setting.png";
import githubIcon from "@assets/images/icon-github.png";
import logOutIcon from "@assets/images/icon-logout.png";

type MenuItem =
  | "home"
  | "message"
  | "bot"
  | "edit-profile"
  | "settings"
  | "github"
  | "logout";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const getActiveItem = (): MenuItem => {
    if (location.pathname.includes("/message")) return "message";
    if (location.pathname.includes("/bot")) return "bot";
    if (location.pathname.includes("/edit-profile")) return "edit-profile";
    if (location.pathname.includes("/settings")) return "settings";
    return "home";
  };

  const [activeItem, setActiveItem] = useState<MenuItem>(getActiveItem());
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const handleClick = (item: MenuItem) => {
    setActiveItem(item);

    switch (item) {
      case "home":
        navigate("/home");
        break;
      case "message":
        navigate("/message");
        break;
      case "bot":
        navigate("/bot");
        break;
      case "edit-profile":
        navigate(`/edit-profile/${user._id}`);
        break;
      case "settings":
        navigate("/settings");
        break;
      case "github":
        window.open("https://github.com/sybui2004", "_blank");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/");
  };

  const getItemStyles = (item: MenuItem) => {
    const isActive = activeItem === item;
    const isHovered = hoveredItem === item;

    let baseClasses = "transition-all duration-300 cursor-pointer";

    if (isHovered) baseClasses += " scale-110";
    if (isActive)
      baseClasses +=
        " bg-gradient-to-r from-[#1CA7EC] to-[#4ADEDE] p-1 rounded-xl shadow-[0_4px_10px_rgba(28,167,236,0.5)]";

    return baseClasses;
  };

  const { user } = useSelector((state: any) => state.authReducer.authData);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <div className="fixed flex flex-col items-center py-4 pl-2 bg-white shadow-lg w-[72px] h-screen border-r border-gray-200 transition-all duration-300 hover:w-[80px] max-md:hidden dark:bg-gray-800 dark:border-gray-700">
      <img
        src={webLogo}
        className="object-contain self-stretch w-full max-md:mr-2.5 hover:scale-105 transition-transform duration-300"
        alt="Application logo"
      />
      <div className="flex flex-col px-px pt-3 pb-4 mt-6 mr-1 rounded-3xl bg-[#E0E0E0] w-full max-w-[90%] transition-all duration-300 hover:bg-[#F0F0F0] max-md:hidden dark:bg-gray-700 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center px-1 pt-3 pb-8 bg-transparent">
          {(["home", "message", "bot"] as MenuItem[]).map((item) => (
            <div
              key={item}
              className={`mt-3 ${getItemStyles(item)}`}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleClick(item)}
            >
              <img
                src={
                  item === "home"
                    ? homeIcon
                    : item === "message"
                    ? messageIcon
                    : botIcon
                }
                className="object-contain w-12 rounded-md aspect-square"
                alt={`${item} icon`}
              />
            </div>
          ))}
        </div>

        <div
          className={`m-auto w-[48px] ${getItemStyles("edit-profile")}`}
          onMouseEnter={() => setHoveredItem("edit-profile")}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleClick("edit-profile")}
        >
          <img
            src={
              user.profilePic
                ? serverPublic + user.profilePic
                : serverPublic + "defaultProfile.png"
            }
            className="object-contain m-auto w-[36px] rounded-3xl aspect-square max-md:mt-10"
            alt="User avatar"
          />
        </div>

        {/* Settings button */}
        <div
          className={`mt-4 ${getItemStyles("settings")}`}
          onMouseEnter={() => setHoveredItem("settings")}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleClick("settings")}
        >
          <img
            src={settingIcon}
            className="object-contain m-auto w-[45px] rounded-2xl aspect-square max-md:mr-2 max-md:ml-1.5"
            alt="Setting icon"
          />
        </div>
      </div>

      {/* Github button */}
      <div
        className={`mt-8 ${getItemStyles("github")}`}
        onMouseEnter={() => setHoveredItem("github")}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => handleClick("github")}
      >
        <img
          src={githubIcon}
          className="object-contain m-auto aspect-square w-[37px] transition-transform duration-300"
          alt="Github icon"
        />
      </div>

      {/* Logout button */}
      <div
        className={`mt-3 ${getItemStyles("logout")} ${
          isLogoutHovered ? "hover:bg-red-100" : ""
        }`}
        onMouseEnter={() => {
          setHoveredItem("logout");
          setIsLogoutHovered(true);
        }}
        onMouseLeave={() => {
          setHoveredItem(null);
          setIsLogoutHovered(false);
        }}
        onClick={() => handleClick("logout")}
      >
        <img
          src={logOutIcon}
          className="object-contain m-auto aspect-square w-[37px] transition-transform duration-300"
          alt="Logout icon"
        />
      </div>
    </div>
  );
};

export default Sidebar;
