"use client";
import { useState } from "react";
import {
  Sidebar,
  Header,
  UserList,
  UserDetail,
  PostList,
  MessageList,
  CommentList,
  Dashboard,
} from "./components";

type ActiveView = "dashboard" | "users" | "posts" | "messages" | "comments";

const AdminPage = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleViewChange = (view: ActiveView) => {
    setSelectedUser(null);
    setActiveView(view);
  };

  const renderMainContent = () => {
    if (selectedUser && activeView === "users") {
      return <UserDetail user={selectedUser} onBack={handleBackToList} />;
    }

    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserList onUserClick={handleUserClick} />;
      case "posts":
        return <PostList />;
      case "messages":
        return <MessageList />;
      case "comments":
        return <CommentList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      <div className="w-[260px] min-w-[260px] flex-shrink-0">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      </div>

      <div className="flex flex-col flex-1 custom-scrollbar">
        <Header
          title={
            selectedUser
              ? selectedUser.name
              : activeView.charAt(0).toUpperCase() + activeView.slice(1)
          }
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 w-full">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
