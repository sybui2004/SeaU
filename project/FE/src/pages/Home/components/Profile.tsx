import { useState, useEffect, useRef, useCallback } from "react";
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
import * as UserApi from "@/api/UserRequest";
import { getUserPosts } from "@/api/PostRequest";
import {
  findConversation,
  createConversation,
} from "@/api/ConversationRequest";

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

  const [mutualFriends, setMutualFriends] = useState(0);

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const postsContainerRef = useRef<HTMLDivElement | null>(null);

  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await UserApi.getUser(profileUserId as string);
        if (response.data) {
          setUserInfo({
            id: profileUserId,
            fullname: response.data.fullname || "User",
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

  useEffect(() => {
    const fetchPostCount = async () => {
      if (!profileUserId) return;

      try {
        const response = await getUserPosts(profileUserId as string, 1, 1);

        if (response.data && response.data.pagination) {
          setTotalPosts(response.data.pagination.totalItems);
        }
      } catch (err) {
        console.error("Error fetching post count:", err);
      }
    };

    fetchPostCount();
  }, [profileUserId]);

  const fetchUserPosts = useCallback(
    async (pageNum: number, append = false) => {
      if (!profileUserId) return;

      setLoadingPosts(true);
      try {
        const response = await getUserPosts(
          profileUserId as string,
          pageNum,
          limit
        );

        if (response.data) {
          console.log("User posts response:", response.data);

          if (response.data.posts) {
            if (response.data.pagination) {
              setTotalPosts(response.data.pagination.totalItems);
              setHasMore(pageNum < response.data.pagination.totalPages);
            } else {
              setTotalPosts(response.data.posts.length);
              setHasMore(
                pageNum < Math.ceil(response.data.posts.length / limit)
              );
            }

            if (append) {
              setUserPosts((prev) => [...prev, ...response.data.posts]);
            } else {
              setUserPosts(response.data.posts);
            }
          } else {
            const posts = Array.isArray(response.data) ? response.data : [];
            setTotalPosts(posts.length);
            setHasMore(false);
            setUserPosts(posts);
          }
        } else {
          if (!append) {
            setUserPosts([]);
          }
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        if (!append) {
          setUserPosts([]);
        }
        setHasMore(false);
      } finally {
        setLoadingPosts(false);
      }
    },
    [profileUserId, limit]
  );

  useEffect(() => {
    setPage(1);
    setUserPosts([]);
    fetchUserPosts(1, false);
  }, [profileUserId, fetchUserPosts]);

  const loadMore = useCallback(() => {
    if (loadingPosts || !hasMore) return;

    const nextPage = page + 1;
    fetchUserPosts(nextPage, true);
    setPage(nextPage);
  }, [page, loadingPosts, hasMore, fetchUserPosts]);

  useEffect(() => {
    if (!hasMore || loadingPosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [observerRef, loadMore, hasMore, loadingPosts]);

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

  useEffect(() => {
    const calculateMutualFriends = () => {
      if (
        profileUserId !== currentUser?._id &&
        currentUser?.friends &&
        userInfo?.friends
      ) {
        console.log("Current user friends:", currentUser.friends);
        console.log("Profile user friends:", userInfo.friends);

        const currentUserFriends: string[] = currentUser.friends || [];
        const profileUserFriends: string[] = userInfo.friends || [];

        const mutuals = profileUserFriends.filter((friendId: string) =>
          currentUserFriends.includes(friendId)
        );

        console.log("Mutual friends:", mutuals);
        setMutualFriends(mutuals.length);
      } else {
        setMutualFriends(0);
      }
    };

    calculateMutualFriends();
  }, [profileUserId, currentUser, userInfo]);

  const handleAddFriend = () => {
    dispatch(
      sendFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("pending");
    setIsMenuOpen(false);
  };

  const handleCancelRequest = () => {
    dispatch(
      cancelFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("not_friend");
    setIsMenuOpen(false);
  };

  const handleAcceptRequest = () => {
    dispatch(
      acceptFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("friend");
    setIsMenuOpen(false);
  };

  const handleRejectRequest = () => {
    dispatch(
      rejectFriendRequest(profileUserId as string, currentUser._id) as any
    );
    setFriendStatus("not_friend");
    setIsMenuOpen(false);
  };

  const handleUnfriend = () => {
    dispatch(unfriendUser(profileUserId as string, currentUser._id) as any);
    setFriendStatus("not_friend");
    setIsMenuOpen(false);
  };

  const handleMessageClick = async () => {
    if (!currentUser || !profileUserId || isCreatingConversation) return;

    setIsCreatingConversation(true);
    try {
      const { data } = await findConversation(currentUser._id, profileUserId);

      if (data && data.conversation) {
        navigate(`/message`);
        localStorage.setItem("currentChatId", data.conversation._id);
      } else {
        const result = await createConversation(currentUser._id, profileUserId);

        if (
          result.data &&
          result.data.conversation &&
          result.data.conversation._id
        ) {
          localStorage.setItem("currentChatId", result.data.conversation._id);
          navigate(`/message`);
        } else {
          console.error("Cannot create conversation:", result);
        }
      }
    } catch (error) {
      console.error("Error creating/finding conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  if (profileUserId && !userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-red-500">User not found</div>
      </div>
    );
  }

  if (!profileUserId || !userInfo) {
    return null;
  }

  return (
    <div className="flex w-full">
      {/* Profile info card - left sidebar */}
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

            <div className="flex justify-center gap-5 text-sm text-gray-500 mt-1">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => navigate(`/friends/${profileUserId}`)}
              >
                {userInfo?.friends?.length || 0} friends
              </span>
              {profileUserId !== currentUser?._id && mutualFriends > 0 && (
                <span
                  className="cursor-pointer hover:underline"
                  title="Mutual friends with you"
                  onClick={() =>
                    navigate(`/friends/${profileUserId}?type=mutual`)
                  }
                >
                  {mutualFriends} mutual
                </span>
              )}
              <span>{totalPosts} posts</span>
            </div>

            <div className="flex justify-center mt-3">
              {profileUserId === currentUser?._id ? (
                <Button
                  variant="gradientCustom"
                  onClick={() => navigate(`/edit-profile/${currentUser._id}`)}
                  className="px-4 py-2 text-sm"
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
                    onClick={handleMessageClick}
                    disabled={isCreatingConversation}
                  >
                    <FontAwesomeIcon icon={faCommentDots} />
                    <div>
                      {isCreatingConversation ? "Đang xử lý..." : "Message"}
                    </div>
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

            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg mt-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCakeCandles}
                  className="text-gray-600 w-4 h-4"
                />
                <span className="text-gray-800 text-sm">
                  {formatDate(userInfo?.dob)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-600 w-4 h-4"
                />
                <span className="text-gray-800 text-sm">
                  {userInfo?.address || "Not specified"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-gray-600 w-4 h-4"
                />
                <span className="text-gray-800 text-sm">
                  {userInfo?.occupation || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 pr-2" ref={postsContainerRef}>
        <div className="ml-10 mb-4 flex justify-center">
          {profileUserId === currentUser?._id && <PostShare />}
        </div>
        <h2 className="text-xl font-semibold ml-10 mb-4 px-4">Posts</h2>
        <div className="flex flex-col gap-5 ml-10">
          {loadingPosts && userPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <div className="animate-pulse">Đang tải bài viết...</div>
            </div>
          ) : userPosts.length > 0 ? (
            <>
              {userPosts.map((post: any, index) => (
                <Post key={post._id || index} data={post} />
              ))}

              <div
                ref={observerRef}
                className="h-14 flex justify-center items-center"
              >
                {loadingPosts && (
                  <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
                )}
              </div>
            </>
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
