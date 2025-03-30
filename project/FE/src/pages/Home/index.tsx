"use client";
import { Header, Post } from "./components";
import Sidebar from "@/components/layout/Sidebar";
import React from "react";

const Home = React.memo(() => {
  // Tạo mảng để render nhiều Post
  const posts = Array(2).fill(null);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      {/* Main Content */}
      <div className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full h-screen overflow-y-scroll custom-scrollbar">
        {/* Header */}
        <Header />
        {/* Content Area */}
        {posts.map((_, index) => (
          <div
            key={index}
            className="flex m-auto overflow-hidden flex-col pt-6 pb-10 max-w-[60%] w-full bg-white px-5 max-md:pl-5 max-md:max-w-full"
          >
            {/* Post Card */}
            <Post />
          </div>
        ))}
      </div>
    </div>
  );
});

export default Home;
