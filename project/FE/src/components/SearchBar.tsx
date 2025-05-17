import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchApi } from "@/api/SearchRequest";
import searchIcon from "@assets/images/icon-search.png";

interface User {
  _id: string;
  fullname: string;
  profilePic?: string;
  occupation?: string;
  friends?: string[];
}

interface Post {
  _id: string;
  content: string;
  userData?: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
}

interface SearchResult {
  users: User[];
  posts: Post[];
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    users: [],
    posts: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length < 1) {
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchApi(searchQuery);

      if (!data) {
        setSearchResults({ users: [], posts: [] });
        return;
      }

      const usersData: User[] = Array.isArray(data.users)
        ? data.users.map((user: User) => ({
            _id: user._id,
            fullname: user.fullname || "Người dùng",
            profilePic: user.profilePic,
            occupation: user.occupation,
          }))
        : [];

      const postsData: Post[] = Array.isArray(data.posts)
        ? data.posts.map((post: Post) => ({
            _id: post._id,
            content:
              typeof post.content === "string"
                ? post.content
                : "Không có nội dung",
            userData: post.userData
              ? {
                  _id: post.userData._id,
                  fullname: post.userData.fullname || "Người dùng",
                  profilePic: post.userData.profilePic,
                }
              : undefined,
          }))
        : [];

      console.log(
        `Tìm thấy: ${usersData.length} người dùng, ${postsData.length} bài viết`
      );

      setSearchResults({
        users: usersData,
        posts: postsData,
      });

      setShowResults(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults({ users: [], posts: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowResults(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div
        className={`flex items-center w-full rounded-full border ${
          isFocused ? "border-blue-400" : "border-gray-300"
        } bg-white px-3 py-2`}
      >
        <input
          type="text"
          placeholder="Search..."
          className="ml-3 mb-1 flex-grow outline-none text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <div
          className="bg-blue-100 rounded-full p-1.5 cursor-pointer"
          onClick={performSearch}
        >
          <img src={searchIcon} className="w-5 h-5" alt="Search" />
        </div>
      </div>

      {/* Dropdown Search Results */}
      {showResults && (
        <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-[9999] custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Đang tìm kiếm...</div>
            </div>
          ) : (
            <div>
              {(!searchResults.users || searchResults.users.length === 0) &&
              (!searchResults.posts || searchResults.posts.length === 0) ? (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              ) : (
                <div>
                  {/* User Results */}
                  {searchResults.users && searchResults.users.length > 0 && (
                    <div className="border-b border-gray-100">
                      <div className="p-2 bg-gray-50 font-semibold text-sm text-gray-700">
                        Users ({searchResults.users.length})
                      </div>
                      {searchResults.users.map((user, index) => (
                        <div
                          key={user._id || index}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleUserClick(user._id)}
                        >
                          <img
                            src={
                              user.profilePic
                                ? `${serverPublic}${user.profilePic}`
                                : `${serverPublic}defaultProfile.png`
                            }
                            alt="User Profile"
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `${serverPublic}defaultProfile.png`;
                            }}
                          />
                          <div>
                            <div className="font-medium">
                              {user.fullname || "User"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.occupation || ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Results */}
                  {searchResults.posts && searchResults.posts.length > 0 && (
                    <div>
                      <div className="p-2 bg-gray-50 font-semibold text-sm text-gray-700">
                        Posts ({searchResults.posts.length})
                      </div>
                      {searchResults.posts.map((post, index) => (
                        <div
                          key={post._id || index}
                          className="p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handlePostClick(post._id)}
                        >
                          <div className="font-medium text-sm truncate">
                            {post.content && typeof post.content === "string"
                              ? post.content.length > 70
                                ? post.content.substring(0, 70) + "..."
                                : post.content
                              : "No content"}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <img
                              src={
                                post.userData?.profilePic
                                  ? `${serverPublic}${post.userData.profilePic}`
                                  : `${serverPublic}defaultProfile.png`
                              }
                              alt="Author"
                              className="w-5 h-5 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `${serverPublic}defaultProfile.png`;
                              }}
                            />
                            <span className="text-xs text-gray-500">
                              {post.userData?.fullname || "User"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View all results button */}
              {(searchResults.users?.length > 0 ||
                searchResults.posts?.length > 0) && (
                <div className="p-3 text-center border-t border-gray-100">
                  <button
                    className="text-blue-500 hover:text-blue-700 font-medium"
                    onClick={handleViewAllResults}
                  >
                    View all results
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
