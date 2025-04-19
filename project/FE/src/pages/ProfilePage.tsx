import { Header, Profile } from "./Home/components";
import Sidebar from "@/components/layout/Sidebar";
import React from "react";

const ProfilePage = React.memo(() => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      {/* Main Content */}
      <div className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full">
        {/* Header */}
        <Header />
        {/* Profile Component */}
        <div className="flex m-auto overflow-hidden flex-col pt-6 pb-10 w-full bg-white px-5 max-md:pl-5 max-md:max-w-full">
          <Profile />
        </div>
      </div>
    </div>
  );
});

export default ProfilePage;
