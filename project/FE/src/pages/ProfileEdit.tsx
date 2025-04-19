import Sidebar from "@/components/layout/Sidebar";
import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import iconTick from "@assets/images/icon-tick.png";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as UserApi from "@/api/UserRequest";
import { uploadImage } from "@/actions/UploadAction";
import { updateUser } from "@/actions/UserAction";

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

const ProfileEdit = () => {
  const [fullname, setfullname] = useState("Bùi Thái Sỹ");
  const [email, setEmail] = useState("symerline2004@gmail.com");
  const [phone, setPhone] = useState("0354823156");
  const [address, setAddress] = useState("Nghệ An");
  const [birthday, setBirthday] = useState<Date | null>(new Date("2004-09-20"));
  const [language, setLanguage] = useState(languageOptions[0]);
  const [occupation, setOccupation] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHovered, setIsHovered] = useState<Record<string, boolean>>({
    fullname: false,
    email: false,
    phone: false,
    address: false,
    birthday: false,
    language: false,
    password: false,
    newpassword: false,
    confirmpassword: false,
    save: false,
    occupation: false,
  });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({
    title: "Success!",
    message: "Profile has been saved successfully.",
  });
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  // Thêm state để lưu URL preview ảnh
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const handleLanguageSelect = (lang: (typeof languageOptions)[0]) => {
    setFormData({ ...formData, language: lang.name });
    setShowLanguageDropdown(false);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const dispatch = useDispatch();
  const params = useParams();
  const profileUserId = params.id;
  const [profileUser, setProfileUser] = useState({});
  const { user } = useSelector((state: any) => state.authReducer.authData);
  const { password, ...other } = user;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(user.profilePic);

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (profileUserId === user._id) {
        setProfileUser(user);
        console.log(user);
      } else {
        const profileUser = await UserApi.getUser(profileUserId as string);
        setProfileUser(profileUser);
        console.log(profileUser);
      }
    };
    fetchProfileUser();
  }, [user]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      // Tạo URL tạm thời để hiển thị ảnh preview
      const imageUrl = URL.createObjectURL(img);
      setPreviewImage(imageUrl); // Lưu URL vào state riêng
      setProfileImage(img);
    }
  };

  // Dọn dẹp URL khi component unmount
  useEffect(() => {
    return () => {
      // Revoke object URL để tránh rò rỉ bộ nhớ
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowNotification(true);
    setNotificationType("success");
    setNotificationMessage({
      title: "Processing...",
      message: "Your profile is being updated.",
    });

    let UserData = formData;
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePic = fileName;
      try {
        dispatch(uploadImage(data) as any);
      } catch (error) {
        console.log(error);
        setNotificationType("error");
        setNotificationMessage({
          title: "Error!",
          message: "Failed to update profile. Please try again.",
        });
      }
    }
    try {
      dispatch(updateUser(params.id as string, UserData) as any);
    } catch (error) {
      console.log(error);
      setNotificationType("error");
      setNotificationMessage({
        title: "Error!",
        message: "Failed to update profile. Please try again.",
      });
    }
    setNotificationType("success");
    setNotificationMessage({
      title: "Success!",
      message: "Profile has been updated successfully.",
    });
    console.log(formData);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <div className="flex h-screen w-screen max-h-screen overflow-hidden bg-white custom-scrollbar">
      <div className="w-[70px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 w-full p-8 pt-1 box-border bg-white">
        <div className="w-full p-6 rounded bg-white">
          <h2 className="text-2xl font-bold">Edit Profile</h2>

          <div className="flex justify-center mb-1">
            <div className="relative">
              <img
                src={
                  previewImage
                    ? previewImage
                    : profileImage
                    ? typeof profileImage === "string" &&
                      profileImage.startsWith("http")
                      ? profileImage
                      : serverPublic + profileImage
                    : serverPublic + "defaultProfile.png"
                }
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
                name="profilePic"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Full Name
              </label>
              <div
                className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                  isHovered.fullname
                    ? "border-[#1CA7EC] shadow-md"
                    : "border-transparent"
                } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, fullname: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, fullname: false }))
                }
              >
                <input
                  type="text"
                  value={formData.fullname || ""}
                  placeholder="Enter your full name"
                  title="Full Name"
                  name="fullname"
                  className="w-full bg-transparent outline-none"
                  onChange={handleChange}
                />
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
                  value={formData.email || ""}
                  placeholder="Enter your email address"
                  title="Email"
                  name="email"
                  className="w-full bg-transparent outline-none"
                  onChange={handleChange}
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
                  value={formData.phone || ""}
                  placeholder="Enter your phone number"
                  title="Contact Number"
                  name="phone"
                  className="w-full bg-transparent outline-none"
                  onChange={handleChange}
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
                  value={formData.address || ""}
                  placeholder="Enter your street address"
                  title="Address"
                  name="address"
                  className="w-full bg-transparent outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Occupation
              </label>
              <div
                className={`flex items-center w-full h-12 px-4 leading-none rounded-2xl border border-solid bg-zinc-100 transition-all duration-300 ${
                  isHovered.occupation
                    ? "border-[#1CA7EC] shadow-md"
                    : "border-transparent"
                } text-zinc-900 max-md:px-5 max-md:max-w-full overflow-hidden`}
                onMouseEnter={() =>
                  setIsHovered((prev) => ({ ...prev, occupation: true }))
                }
                onMouseLeave={() =>
                  setIsHovered((prev) => ({ ...prev, occupation: false }))
                }
              >
                <input
                  type="text"
                  value={formData.occupation || ""}
                  placeholder="Enter your occupation"
                  title="Occupation"
                  name="occupation"
                  className="w-full bg-transparent outline-none"
                  onChange={handleChange}
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
                    selected={formData.dob ? new Date(formData.dob) : null}
                    onChange={(date: Date | null) =>
                      setFormData({ ...formData, dob: date })
                    }
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
                        name="dob"
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
                    <span>{formData.language || "Select language"}</span>
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
                        <span>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                )}
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
        <div
          className={`fixed top-4 right-4 ${
            notificationType === "success"
              ? "bg-blue-100 border-blue-200 text-blue-500"
              : "bg-red-100 border-red-200 text-red-500"
          } border-l-4 p-4 rounded shadow-md transition-all duration-500 z-50`}
        >
          <div className="flex items-center">
            <div className="py-1">
              <img
                src={iconTick}
                alt={notificationType === "success" ? "Success" : "Error"}
                className="w-8 mr-2"
              />
            </div>
            <div>
              <p className="font-bold">{notificationMessage.title}</p>
              <p className="text-sm">{notificationMessage.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
