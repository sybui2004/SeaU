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
import { getTimelinePost } from "@/actions/PostAction";
import { getUserProfile } from "@/actions/UserAction";

const Profile = () => {
  const dispatch = useDispatch();
  const [isFriend, setIsFriend] = useState(false);
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
  const { posts, loading: postsLoading } = useSelector(
    (state: any) => state.postReducer
  );
  const { userProfiles, loading: userLoading } = useSelector(
    (state: any) => state.userReducer
  );

  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  const profileUser = profileUserId ? userProfiles[profileUserId] : null;

  useEffect(() => {
    if (currentUser && profileUser) {
      setIsFriend(currentUser.friends?.includes(profileUserId) || false);
    }
  }, [currentUser, profileUser, profileUserId]);

  useEffect(() => {
    if (
      profileUserId &&
      (!profileUser || Object.keys(profileUser).length === 0)
    ) {
      dispatch(getUserProfile(profileUserId) as any);
    }
  }, [dispatch, profileUserId, profileUser]);

  // Lọc bài viết của profileUser
  const userPosts = Array.isArray(posts)
    ? posts.filter((post: any) => post.userId === profileUserId)
    : [];

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(getTimelinePost(profileUserId || "") as any);
    }
  }, [dispatch, currentUser._id, currentUser.friends, posts]);

  // // Xử lý khi người dùng click vào nút kết bạn
  // const handleAddFriend = () => {
  //   dispatch(followUser(profileUserId || "", currentUser._id) as any);
  //   setIsFriend(true);
  // };

  // // Xử lý khi người dùng click vào nút hủy kết bạn
  // const handleUnfriend = () => {
  //   dispatch(unfollowUser(profileUserId || "", currentUser._id) as any);
  //   setIsFriend(false);
  //   setIsMenuOpen(false);
  // };

  // Hiển thị loading khi đang lấy thông tin profile
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-2xl text-gray-500">
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  // Nếu không tìm thấy profile người dùng
  // if (profileUserId && !profileUser) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="text-2xl text-red-500">
  //         Không tìm thấy thông tin người dùng
  //       </div>
  //     </div>
  //   );
  // }

  // Nếu không có profileUserId hoặc không có profileUser
  // if (!profileUserId || !profileUser) {
  //   return null;
  // }

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
                    profileUser.profilePicture
                      ? serverPublic + profileUser.profilePicture
                      : serverPublic + "defaultProfile.png"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-lg pt-16 pb-4 px-4 text-center shadow-sm">
            <h2 className="text-2xl font-bold mt-2">{profileUser.fullname}</h2>

            <div className="flex justify-center gap-10 text-4 text-gray-500 mt-1">
              <span>{profileUser.friends?.length || 0} friends</span>
              {/* <span>{userData.mutuals} mutuals</span> */}
              <span>{userPosts.length} posts</span>
            </div>

            <div className="flex justify-center mt-3">
              {profileUserId === currentUser._id ? (
                <Button
                  variant="gradientCustom"
                  onClick={() => navigate(`/edit-profile/${currentUser._id}`)}
                >
                  Edit Profile
                </Button>
              ) : isFriend ? (
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
                        // onClick={handleUnfriend}
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
                  // onClick={handleAddFriend}
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
                <span>{profileUser.dob || "Not specified"}</span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-600"
                />
                <span>{profileUser.address || "Not specified"}</span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBriefcase} className="text-gray-600" />
                <span>{profileUser.occupation || "Not specified"}</span>
              </div>

              {/* {userData.relationshipStatus && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={getRelationshipIcon(userData.relationshipStatus)}
                    className="text-gray-600"
                  />
                  <span>{userData.relationshipStatus}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 pr-2">
        <div className="ml-10 mb-4 flex justify-center">
          {profileUserId === currentUser._id && <PostShare />}
        </div>
        <h2 className="text-2xl font-semibold ml-10 mb-4 px-4">Posts</h2>
        <div className="flex flex-col gap-5">
          {postsLoading ? (
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
