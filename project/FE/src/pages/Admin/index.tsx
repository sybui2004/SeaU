"use client";
import { useState, useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { getUserDetail } from "@/api/UserRequest";
import {
  Sidebar,
  Header,
  UserList,
  UserDetail,
  PostList,
  ConversationList,
  CommentList,
  Dashboard,
} from "./components";

type ActiveView =
  | "dashboard"
  | "users"
  | "posts"
  | "conversations"
  | "comments";

const AdminPage = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const navigate = useNavigate();

  const handleUserClick = (user: any) => {
    navigate(`/admin/users/${user._id}`);
  };

  const handleViewChange = (view: ActiveView) => {
    setSelectedUser(null);
    setActiveView(view);

    switch (view) {
      case "dashboard":
        navigate("/admin");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "posts":
        navigate("/admin/posts");
        break;
      case "conversations":
        navigate("/admin/conversations");
        break;
      case "comments":
        navigate("/admin/comments");
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      <div className="w-[260px] min-w-[260px] flex-shrink-0">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      </div>

      <div className="flex flex-col flex-1 custom-scrollbar">
        <Header
          title={activeView.charAt(0).toUpperCase() + activeView.slice(1)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/users"
              element={<UserList onUserClick={handleUserClick} />}
            />
            <Route path="/users/:userId" element={<UserDetailWrapper />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/conversations" element={<ConversationList />} />
            <Route path="/comments" element={<CommentList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const UserDetailWrapper = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        try {
          const response = await getUserDetail(userId!);
          if (response.data) {
            setUser(response.data.user);
          } else {
            throw new Error("User data not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  return <UserDetail user={user} />;
};

export default AdminPage;
