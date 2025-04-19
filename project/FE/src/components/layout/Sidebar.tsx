import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import webLogo from "@assets/images/web-logo.png";
import homeIcon from "@assets/images/icon-home.png";
import messageIcon from "@assets/images/icon-message.png";
import botIcon from "@assets/images/icon-bot.png";
import settingIcon from "@assets/images/icon-setting.png";
import githubIcon from "@assets/images/icon-github.png";
import logOutIcon from "@assets/images/icon-logout.png";
import { useSelector } from "react-redux";
type MenuItem =
  | "home"
  | "message"
  | "bot"
  | "edit-profile"
  | "settings"
  | "github";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settingsRef = useRef<HTMLDivElement>(null);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettingsMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef]);

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
        navigate(`/test/edit-profile`);
        break;
      case "github":
        window.open("https://github.com/sybui2004", "_blank");
        break;
      default:
        break;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
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
    <div className="fixed flex flex-col items-center py-4 pl-2 bg-white shadow-lg w-[72px] h-screen border-r border-gray-200 transition-all duration-300 hover:w-[80px] max-md:hidden">
      <img
        src={webLogo}
        className="object-contain self-stretch w-full max-md:mr-2.5 hover:scale-105 transition-transform duration-300"
        alt="Application logo"
      />
      <div className="flex flex-col px-px pt-3 pb-4 mt-6 mr-1 rounded-3xl bg-[#E0E0E0] w-full max-w-[90%] transition-all duration-300 hover:bg-[#F0F0F0] max-md:hidden">
        <div className="flex flex-col items-center px-1 pt-3 pb-20 bg-transparent">
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
          onClick={() => navigate(`/edit-profile/${user._id}`)}
        >
          <img
            src={
              user.profilePicture
                ? serverPublic + user.profilePicture
                : serverPublic + "defaultProfile.png"
            }
            className="object-contain m-auto w-[36px] rounded-3xl aspect-square max-md:mt-10"
            alt="User avatar"
          />
        </div>

        {/* Settings button with dropdown menu */}
        <div
          ref={settingsRef}
          className={`mt-4 transition-all duration-300 cursor-pointer ${
            hoveredItem === "settings" ? "scale-110" : ""
          } relative`}
          onMouseEnter={() => {
            setHoveredItem("settings");
            setShowSettingsMenu(true);
          }}
          onMouseLeave={() => {
            setHoveredItem(null);
          }}
        >
          <img
            src={settingIcon}
            className="object-contain m-auto w-[45px] rounded-2xl aspect-square max-md:mr-2 max-md:ml-1.5"
            alt="Setting icon"
          />

          {/* Settings dropdown menu */}
          {showSettingsMenu && (
            <div
              className="absolute left-full ml-3 bottom-0 bg-white rounded-lg shadow-lg w-44 p-2 border border-gray-200 z-[1000]"
              onMouseLeave={() => setShowSettingsMenu(false)}
            >
              <div className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                <label htmlFor="toggle" className="font-medium cursor-pointer">
                  Dark mode
                </label>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    aria-label="Toggle dark mode"
                    title="Toggle dark mode"
                    placeholder="Toggle dark mode"
                  />
                  <label
                    htmlFor="toggle"
                    className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                      darkMode ? "bg-blue-500" : ""
                    }`}
                  >
                    <span
                      className={`dot block h-6 w-6 rounded-full bg-white border border-gray-300 shadow transform transition-transform duration-200 ease-in-out ${
                        darkMode ? "translate-x-4" : ""
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              <div
                className={`flex items-center px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
                  isLogoutHovered
                    ? "bg-red-50 shadow-sm scale-[1.02]"
                    : "hover:bg-gray-100"
                }`}
                onClick={handleLogout}
                onMouseEnter={() => setIsLogoutHovered(true)}
                onMouseLeave={() => setIsLogoutHovered(false)}
              >
                <div
                  className={`font-medium text-gray-700 ${
                    isLogoutHovered ? "text-red-600" : ""
                  } transition-colors duration-300`}
                >
                  Log out
                </div>
                <img
                  src={logOutIcon}
                  alt="Log out icon"
                  className={`w-5 h-5 ml-auto transition-transform duration-300 ${
                    isLogoutHovered ? "scale-110" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default Sidebar;
