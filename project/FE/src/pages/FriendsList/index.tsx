import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "@/components/layout/Sidebar";
import { useSelector } from "react-redux";
import Header from "@/components/layout/Header";
import UserItem from "@/components/UserItem";
import { getUser, getFriendsList } from "@/api/UserRequest";

const FriendsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const userId = params.id;
  const queryParams = new URLSearchParams(location.search);
  const listType = queryParams.get("type") || "all";

  const { user: currentUser } = useSelector(
    (state: any) => state.authReducer.authData
  );
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  const [userInfo, setUserInfo] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUser(userId as string);
        if (response.data) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userInfo) return;

      setLoading(true);
      try {
        const response = await getFriendsList(
          userId as string,
          currentPage,
          itemsPerPage
        );

        const { friends, totalPages: pages } = response.data;

        let friendsData = friends;
        if (
          listType === "mutual" &&
          currentUser &&
          userId !== currentUser._id
        ) {
          friendsData = friends.filter((friend: any) =>
            currentUser.friends.includes(friend._id)
          );
        }

        setFriends(friendsData);
        setTotalPages(pages);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userInfo, listType, currentUser, userId, currentPage]);

  const filteredFriends = friends.filter((friend) =>
    friend.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const toggleListType = () => {
    const newType = listType === "all" ? "mutual" : "all";
    navigate(`/friends/${userId}?type=${newType}`);
    setCurrentPage(1);
  };
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full h-screen overflow-y-scroll custom-scrollbar">
        <Header />
        <div className="container mx-auto py-6 px-4 max-w-4xl">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold flex-1">
              {userInfo?.fullname}'s {listType === "mutual" ? "Mutual" : ""}{" "}
              Friends
            </h1>

            {userId !== currentUser?._id && (
              <Button
                variant="outline"
                onClick={toggleListType}
                className="ml-2"
              >
                <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                {listType === "all" ? "Show Mutual" : "Show All"}
              </Button>
            )}
          </div>

          {/* Search */}
          <div
            className={`flex mb-10 items-center w-full rounded-full border ${
              isFocused ? "border-blue-400" : "border-gray-300"
            } bg-white px-3 py-2`}
          >
            <input
              type="text"
              placeholder="Search friends..."
              className="ml-3 mb-1 flex-grow outline-none text-gray-700"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {/* Friends list */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : filteredFriends.length > 0 ? (
            <div className="space-y-4">
              {filteredFriends.map((friend) => (
                <UserItem
                  key={friend._id}
                  user={friend}
                  serverPublic={serverPublic}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-10 text-center shadow-sm">
              <FontAwesomeIcon
                icon={faUserGroup}
                className="text-gray-300 text-5xl mb-4"
              />
              <p className="text-gray-500">
                {searchQuery
                  ? "No friends match your search."
                  : listType === "mutual"
                  ? "No mutual friends found."
                  : "No friends yet."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!searchQuery && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav
                className="inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
