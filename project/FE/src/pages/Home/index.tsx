"use client";
import { Header, Post, PostShare } from "./components";
import Sidebar from "@/components/layout/Sidebar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimelinePost } from "@/actions/PostAction";
const Home = React.memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.authReducer.authData);
  const { posts, loading } = useSelector((state: any) => state.postReducer);

  useEffect(() => {
    dispatch(getTimelinePost(user._id) as any);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      {/* Main Content */}
      <div className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full h-screen overflow-y-scroll custom-scrollbar">
        {/* Header */}
        <Header />
        {/* Content Area */}
        <div className="flex m-auto overflow-hidden flex-col pt-6 pb-5 max-w-[60%] w-full bg-white my-5 px-5 max-md:pl-5 max-md:max-w-full rounded-lg shadow-sm">
          <PostShare />
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        ) : (
          posts.map((post: any, index: any) => (
            <div
              key={post._id || index}
              className="flex m-auto overflow-hidden flex-col pt-6 pb-10 max-w-[60%] w-full bg-white my-5 px-5 max-md:pl-5 max-md:max-w-full rounded-lg shadow-sm"
            >
              {/* Post Card */}
              <Post data={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default Home;
