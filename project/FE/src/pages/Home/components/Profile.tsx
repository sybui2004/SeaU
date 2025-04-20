import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Post from "./Post";
import PostShare from "./PostShare";
import plusAddFriend from "@assets/images/plus-add-friend.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCakeCandles,
  faBriefcase,
  faUserGroup,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  unfriendUser,
} from "@/actions/UserAction";
import axios from "axios";

// Hàm format ngày tháng
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not specified";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Not specified";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Not specified";
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  const [friendStatus, setFriendStatus] = useState<
    "not_friend" | "pending" | "received" | "friend"
  >("not_friend");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState({
    addFriend: false,
    editProfile: false,
  });
  const navigate = useNavigate();
  const params = useParams();
  const profileUserId = params.id;

  const { user: currentUser } = useSelector(
    (state: any) => state.authReducer.authData
  );

  // State cho thông tin người dùng
  const [userInfo, setUserInfo] = useState<any>({
    id: profileUserId,
    fullname: null,
    profilePic: null,
    dob: null,
    address: null,
    occupation: null,
    friends: [],
    receivedFriendRequests: [],
    sentFriendRequests: [],
  });

  // State để lưu bài đăng của người dùng
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/${profileUserId}`
        );
        if (response.data) {
          console.log("API response data:", response.data);
          setUserInfo({
            id: profileUserId,
            fullname: response.data.fullname || "Người dùng",
            profilePic: response.data.profilePic,
            dob: response.data.dob || null,
            address: response.data.address || null,
            occupation: response.data.occupation || null,
            friends: response.data.friends || [],
            receivedFriendRequests: response.data.receivedFriendRequests || [],
            sentFriendRequests: response.data.sentFriendRequests || [],
          });
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, [profileUserId]);

  // Lấy bài đăng của người dùng từ API
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profileUserId) return;

      setLoadingPosts(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/post/${profileUserId}/timeline`
        );

        if (response.data) {
          console.log("User posts response:", response.data);
          const filteredPosts = response.data.filter(
            (post: any) => post.userId === profileUserId
          );

          setUserPosts(filteredPosts);
        } else {
          setUserPosts([]);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setUserPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [profileUserId]);

  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {
    if (currentUser && userInfo) {
      if (userInfo.friends?.includes(currentUser._id)) {
        setFriendStatus("friend");
      } else if (userInfo.receivedFriendRequests?.includes(currentUser._id)) {
        setFriendStatus("pending");
      } else if (currentUser.receivedFriendRequests?.includes(profileUserId)) {
        setFriendStatus("received");
      } else {
        setFriendStatus("not_friend");
      }
    }
  }, [currentUser, userInfo, profileUserId]);

  useEffect(() => {
    if (profileUserId && (!userInfo || Object.keys(userInfo).length === 0)) {
      dispatch(getUserProfile(profileUserId) as any);
    }
  }, [dispatch, profileUserId, userInfo]);

  // Xử lý khi người dùng click vào nút kết bạn
  const handleAddFriend = () => {
    dispatch(
      sendFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("pending");
    setIsMenuOpen(false);
  };

  // Xử lý khi người dùng click vào nút hủy lời mời kết bạn
  const handleCancelRequest = () => {
    dispatch(
      cancelFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("not_friend");
    setIsMenuOpen(false);
  };

  // Xử lý khi người dùng click vào nút chấp nhận lời mời kết bạn
  const handleAcceptRequest = () => {
    dispatch(
      acceptFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("friend");
    setIsMenuOpen(false);
  };

  // Xử lý khi người dùng click vào nút từ chối lời mời kết bạn
  const handleRejectRequest = () => {
    dispatch(
      rejectFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("not_friend");
    setIsMenuOpen(false);
  };

  // Xử lý khi người dùng click vào nút hủy kết bạn
  const handleUnfriend = () => {
    dispatch(unfriendUser(profileUserId as string, currentUser._id) as any);
    setFriendStatus("not_friend");
    setIsMenuOpen(false);
  };

  // Hiển thị loading khi đang lấy thông tin profile
  //Nếu không tìm thấy profile người dùng
  if (profileUserId && !userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-red-500">
          Không tìm thấy thông tin người dùng
        </div>
      </div>
    );
  }

  //Nếu không có profileUserId hoặc không có profileUser
  if (!profileUserId || !userInfo) {
    return null;
  }

  return (
    <div className="flex w-full">
      {/* Fixed width sidebar container */}
      <div className="w-[350px] flex-shrink-0 relative">
        <div className="fixed w-[350px] ml-5">
          <div className="w-full h-32 bg-gradient-to-r from-[#1CA7EC] to-[#4ADEDE] rounded-t-lg relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
                <img
                  src={
                    userInfo?.profilePic
                      ? serverPublic + userInfo.profilePic
                      : serverPublic + "defaultProfile.png"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-lg pt-16 pb-4 px-4 text-center shadow-sm">
            <h2 className="text-2xl font-bold mt-2">{userInfo?.fullname}</h2>

            <div className="flex justify-center gap-10 text-4 text-gray-500 mt-1">
              <span>{userInfo?.friends?.length || 0} friends</span>
              {/* <span>{userData.mutuals} mutuals</span> */}
              <span>{userPosts.length} posts</span>
            </div>

            <div className="flex justify-center mt-3">
              {profileUserId === currentUser?._id ? (
                <Button
                  variant="gradientCustom"
                  onClick={() => navigate(`/edit-profile/${currentUser._id}`)}
                >
                  Edit Profile
                </Button>
              ) : friendStatus === "friend" ? (
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
                    <div className="absolute left-0 ml-4 mt-10 w-40 bg-white rounded-lg shadow-lg border border-gray-300">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={handleUnfriend}
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
              ) : friendStatus === "pending" ? (
                <Button
                  variant="gradientCustom"
                  className="flex items-center gap-2 px-3 py-3 mt-1.5 text-base leading-loose text-white shadow-md transition-all duration-300"
                  onClick={handleCancelRequest}
                >
                  Pending Request
                </Button>
              ) : friendStatus === "received" ? (
                <div className="flex gap-2">
                  <Button
                    variant="gradientCustom"
                    className="flex items-center gap-2 px-3 py-3 mt-1.5 text-base leading-loose text-white shadow-md transition-all duration-300"
                    onClick={handleAcceptRequest}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="gradientCustom"
                    className="flex items-center gap-2 px-3 py-3 mt-1.5 text-base leading-loose text-white shadow-md transition-all duration-300"
                    onClick={handleRejectRequest}
                  >
                    Reject
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
                  onClick={handleAddFriend}
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
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCakeCandles}
                  className="text-gray-600"
                />
                <span className="text-gray-800">
                  {formatDate(userInfo?.dob)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-600"
                />
                <span className="text-gray-800">
                  {userInfo?.address || "Not specified"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBriefcase} className="text-gray-600" />
                <span className="text-gray-800">
                  {userInfo?.occupation || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 pr-2">
        <div className="ml-10 mb-4 flex justify-center">
          {profileUserId === currentUser?._id && <PostShare />}
        </div>
        <h2 className="text-2xl font-semibold ml-10 mb-4 px-4">Posts</h2>
        <div className="flex flex-col gap-5">
          {loadingPosts ? (
            <div className="text-center text-gray-500 py-10">
              <div className="animate-pulse">Đang tải bài viết...</div>
            </div>
          ) : userPosts.length > 0 ? (
            userPosts.map((post: any) => <Post key={post._id} data={post} />)
          ) : (
            <div className="text-center text-gray-500 py-10">
              Chưa có bài viết nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
