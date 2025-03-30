import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Post from "./Post";
import ava from "@assets/images/ava.png";
import plusAddFriend from "@assets/images/plus-add-friend.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCakeCandles,
  faBriefcase,
  faHeartCrack,
  faHeart,
  faUserGroup,
  faUser,
  faRing,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

// Thêm props username vào component
interface ProfileProps {
  username?: string;
}

const getRelationshipIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "broke up":
      return faHeartCrack;
    case "dating":
      return faHeart;
    case "married":
      return faRing;
    case "single":
      return faUser;
    default:
      return faUser;
  }
};

const Profile = ({ username }: ProfileProps) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState({
    addFriend: false,
    editProfile: false,
  });
  const navigate = useNavigate();

  // State để lưu trữ thông tin user
  const [userData, setUserData] = useState({
    name: "",
    dob: "",
    location: "",
    occupation: "",
    relationshipStatus: "",
    friends: 0,
    mutuals: 0,
    posts: [],
  });

  useEffect(() => {
    if (username === "my-love") {
      setUserData({
        name: "My love",
        dob: "Oct 5, 2007",
        location: "Da Nang, Vietnam",
        occupation: "Software Engineer at ABC Company",
        relationshipStatus: "Single",
        friends: 200,
        mutuals: 10,
        posts: [],
      });
    } else {
      setUserData({
        name: username || "User not found",
        dob: "",
        location: "",
        occupation: "",
        relationshipStatus: "",
        friends: 0,
        mutuals: 0,
        posts: [],
      });
    }
  }, [username]);

  return (
    <div className="flex w-full">
      {/* Fixed width sidebar container */}
      <div className="w-[350px] flex-shrink-0 relative">
        <div className="fixed w-[350px] ml-5">
          <div className="w-full h-32 bg-gradient-to-r from-[#1CA7EC] to-[#4ADEDE] rounded-t-lg relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
                <img
                  src={ava}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-lg pt-16 pb-4 px-4 text-center shadow-sm">
            <h2 className="text-2xl font-bold mt-2">{userData.name}</h2>

            <div className="flex justify-center gap-10 text-4 text-gray-500 mt-1">
              <span>{userData.friends} friends</span>
              <span>{userData.mutuals} mutuals</span>
            </div>

            <div className="flex justify-center mt-3">
              {isFriend ? (
                <div className="flex gap-4">
                  <Button
                    variant="gradientCustom"
                    className="flex items-center gap-2 px-3 py-3 mt-1.5 text-base leading-loose text-white shadow-md transition-all duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <FontAwesomeIcon icon={faUserGroup} />
                    <div>Friend</div>
                  </Button>
                  {isMenuOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-300">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          alert("User has been blocked!");
                          setIsMenuOpen(false);
                        }}
                      >
                        🚫 Block
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setIsFriend(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        ❌ Unfriend
                      </button>
                    </div>
                  )}
                  <Button
                    variant="gradientCustom"
                    className="flex items-center gap-2 px-3 py-3 mt-1.5 text-base leading-loose text-white shadow-md transition-all duration-300"
                    onClick={() => navigate("/message")}
                  >
                    <FontAwesomeIcon icon={faCommentDots} />
                    <div>Message</div>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="gradientCustom"
                  className={`flex items-center gap-2 px-3 py-3 mt-1.5 h-full text-base leading-loose text-white shadow-md transition-all duration-300 ${
                    isHovered.addFriend ? "shadow-lg scale-105" : ""
                  } cursor-pointer`}
                  onMouseEnter={() =>
                    setIsHovered((prev) => ({ ...prev, addFriend: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovered((prev) => ({ ...prev, addFriend: false }))
                  }
                  onClick={() => setIsFriend(true)}
                >
                  <img
                    src={plusAddFriend}
                    className={`object-contain shrink-0 aspect-[1.2] w-[30px] transition-transform duration-300 ${
                      isHovered.addFriend ? "scale-110" : ""
                    }`}
                    alt="Add friend icon"
                  />
                  <div>Add friend</div>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
              {userData.dob && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCakeCandles}
                    className="text-gray-600"
                  />
                  <span>{userData.dob}</span>
                </div>
              )}

              {userData.location && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-gray-600"
                  />
                  <span>{userData.location}</span>
                </div>
              )}

              {userData.occupation && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="text-gray-600"
                  />
                  <span>{userData.occupation}</span>
                </div>
              )}

              {userData.relationshipStatus && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={getRelationshipIcon(userData.relationshipStatus)}
                    className="text-gray-600"
                  />
                  <span>{userData.relationshipStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 pr-2">
        <h2 className="text-2xl font-semibold ml-10 mb-4 px-4">Posts</h2>
        <div className="flex flex-col gap-5">
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </div>
  );
};

export default Profile;
