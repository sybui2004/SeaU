import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Post from "./Home/components/Post";
import { useSelector } from "react-redux";
import Sidebar from "@/components/layout/Sidebar";
import Header from "./Home/components/Header";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const { user: currentUser } = useSelector(
    (state: any) => state.authReducer.authData
  );
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  // Lấy search term từ URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const encoded = encodeURIComponent(query);
      const response = await axios.get(
        `http://localhost:3000/search?q=${encoded}`
      );

      if (response.data) {
        // Lấy kết quả bài viết
        const postsData = Array.isArray(response.data.posts)
          ? response.data.posts
          : [];
        setPosts(postsData);

        // Lấy kết quả người dùng
        const usersData = Array.isArray(response.data.users)
          ? response.data.users
          : [];
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full h-screen overflow-y-scroll custom-scrollbar">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">
              Kết quả tìm kiếm cho:{" "}
              <span className="text-blue-500">"{searchTerm}"</span>
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "posts"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Bài viết ({posts.length})
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "users"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Người dùng ({users.length})
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === "posts" && (
                <div className="space-y-6 gap-4 mb-2">
                  {posts.length > 0 ? (
                    posts.map((post) => <Post key={post._id} data={post} />)
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        Không tìm thấy bài viết nào phù hợp.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "users" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
                        onClick={() => handleUserClick(user._id)}
                      >
                        <img
                          src={
                            user.profilePic
                              ? `${serverPublic}${user.profilePic}`
                              : `${serverPublic}defaultProfile.png`
                          }
                          alt={user.fullname}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${serverPublic}defaultProfile.png`;
                          }}
                        />
                        <div>
                          <h3 className="font-medium text-lg">
                            {user.fullname}
                          </h3>
                          {user.occupation && (
                            <p className="text-gray-500 text-sm">
                              {user.occupation}
                            </p>
                          )}
                          {user.friends && (
                            <p className="text-gray-500 text-xs mt-1">
                              {user.friends.length} bạn bè
                              {user.friends.includes(currentUser?._id) &&
                                " • Bạn bè"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg col-span-2">
                      <p className="text-gray-500">
                        Không tìm thấy người dùng nào phù hợp.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
