import Sidebar from "@/components/layout/Sidebar";
import React, { useState, useRef, useEffect } from "react";

import hideLogin from "@assets/images/hide-login.png";
import showLogin from "@assets/images/show-login.png";
import ava from "@assets/images/ava.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import iconTick from "@assets/images/icon-tick.png";

const languageOptions = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "French" },
  { code: "de", flag: "🇩🇪", name: "German" },
  { code: "es", flag: "🇪🇸", name: "Spanish" },
  { code: "it", flag: "🇮🇹", name: "Italian" },
  { code: "pt", flag: "🇵🇹", name: "Portuguese" },
  { code: "ru", flag: "🇷🇺", name: "Russian" },
  { code: "ja", flag: "🇯🇵", name: "Japanese" },
  { code: "ko", flag: "🇰🇷", name: "Korean" },
  { code: "zh", flag: "🇨🇳", name: "Chinese" },
  { code: "ar", flag: "🇸🇦", name: "Arabic" },
  { code: "hi", flag: "🇮🇳", name: "Hindi" },
  { code: "vi", flag: "🇻🇳", name: "Vietnamese" },
];

const ProfileEdit: React.FC = () => {
  const [firstName, setFirstName] = useState("Bùi Thái");
  const [lastName, setLastName] = useState("Sỹ");
  const [email, setEmail] = useState("symerline2004@gmail.com");
  const [phone, setPhone] = useState("0354823156");
  const [address, setAddress] = useState("Nghệ An");
  const [birthday, setBirthday] = useState<Date | null>(new Date("2004-09-20"));
  const [language, setLanguage] = useState(languageOptions[0]);
  const [password, setPassword] = useState("********");
  const [isHovered, setIsHovered] = useState<Record<string, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    birthday: false,
    language: false,
    password: false,
    save: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const [profileImage, setProfileImage] = useState(ava);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageDropdownRef]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLanguageSelect = (lang: (typeof languageOptions)[0]) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const handleSave = () => {
    console.log("Profile saved");
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      console.log(
        "File đã chọn:",
        file.name,
        "Size:",
        Math.round(file.size / 1024),
        "KB"
      );
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen w-screen max-h-screen overflow-hidden bg-white custom-scrollbar">
      <div className="w-[70px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 w-full p-8 box-border overflow-y-auto bg-white">
        <div className="w-full p-6 rounded bg-white">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div
                className="absolute bottom-0 right-0 bg-gray-300 hover:bg-blue-600 rounded-full p-2 cursor-pointer transition-colors"
                onClick={handleCameraClick}
              >
                <span className="text-white text-sm">📷</span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                title="Profile Picture Upload"
                placeholder="Choose a profile picture"
                aria-label="Upload profile picture"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  First Name
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                    isHovered.firstName
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, firstName: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, firstName: false }))
                  }
                >
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    title="First Name"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Last Name
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                    isHovered.lastName
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, lastName: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, lastName: false }))
                  }
                >
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    title="Last Name"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div
                className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                  isHovered.email
                    ? "border-[#1CA7EC] shadow-md"
                    : "border-transparent"
                } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, email: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, email: false }))
                }
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  title="Email"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Contact Number
              </label>
              <div
                className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                  isHovered.phone
                    ? "border-[#1CA7EC] shadow-md"
                    : "border-transparent"
                } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, phone: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, phone: false }))
                }
              >
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  title="Contact Number"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Address
              </label>
              <div
                className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                  isHovered.address
                    ? "border-[#1CA7EC] shadow-md"
                    : "border-transparent"
                } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, address: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, address: false }))
                }
              >
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street address"
                  title="Address"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Birthday
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                    isHovered.birthday
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:max-w-full overflow-hidden`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, birthday: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, birthday: false }))
                  }
                >
                  <DatePicker
                    selected={birthday}
                    onChange={(date: Date | null) => setBirthday(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    placeholderText="Select birthday"
                    className="w-full h-full bg-transparent outline-none flex items-center"
                    wrapperClassName="w-full h-full flex items-center"
                    popperClassName="z-50"
                    customInput={
                      <input
                        className="w-full h-full bg-transparent outline-none mt-3 flex items-center"
                        placeholder="Select birthday"
                        title="Birthday"
                      />
                    }
                  />
                </div>
              </div>
              <div className="relative" ref={languageDropdownRef}>
                <label className="block text-sm text-gray-600 mb-1">
                  Language
                </label>
                <div
                  className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 cursor-pointer ${
                    isHovered.language || showLanguageDropdown
                      ? "border-[#1CA7EC] shadow-md"
                      : "border-transparent"
                  } text-zinc-900 max-md:px-5 max-md:max-w-full`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, language: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, language: false }))
                  }
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  <div className="flex items-center w-full">
                    <span className="mr-2 text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  <div className="absolute right-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${
                        showLanguageDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {showLanguageDropdown && (
                  <div className="absolute z-[100] mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {languageOptions.map((lang) => (
                      <div
                        key={lang.code}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLanguageSelect(lang);
                        }}
                      >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <div
                className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                  isHovered.password
                    ? "border-[#1CA7EC] shadow-md"
                    : "border-transparent"
                } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden relative`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, password: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, password: false }))
                }
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  title="Password"
                  className="w-full bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="w-10 h-10 rounded-md absolute top-2/4 -translate-y-2/4 cursor-pointer right-[15px] flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? hideLogin : showLogin}
                    className="w-5 h-5 max-w-none"
                    alt={showPassword ? "Hide password" : "Show password"}
                  />
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-3 h-10 text-base leading-loose rounded-2xl text-white bg-gradient-to-r from-[#1CA7EC] to-[#33C3E6] shadow-[0_4px_10px_rgba(28,167,236,0.5)] transition-all duration-300 ${
                  isHovered.save ? "shadow-lg scale-105" : ""
                } cursor-pointer`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, save: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, save: false }))
                }
              >
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-200 text-blue-500 p-4 rounded shadow-md transition-all duration-500 z-50">
          <div className="flex items-center">
            <div className="py-1">
              <img src={iconTick} alt="Success" className="w-8 mr-2" />
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Profile has been saved successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
