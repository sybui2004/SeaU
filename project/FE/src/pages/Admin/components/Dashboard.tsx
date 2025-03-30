import { FC, useState } from "react";
import ava from "@assets/images/ava.png";

const Dashboard: FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<number | null>(null);
  const [activeActivity, setActiveActivity] = useState<number | null>(null);

  const stats = [
    {
      title: "Total Users",
      value: "1,240",
      icon: "👥",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      activeColor: "active:bg-blue-700",
    },
    {
      title: "New Users",
      value: "85",
      icon: "🆕",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      activeColor: "active:bg-green-700",
    },
    {
      title: "Total Posts",
      value: "723",
      icon: "📝",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      activeColor: "active:bg-purple-700",
    },
    {
      title: "Total Views",
      value: "12,845",
      icon: "👁️",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      activeColor: "active:bg-yellow-700",
    },
  ];

  const recentActivities = [
    { user: "Nguyễn Văn A", action: "đăng bài viết mới", time: "5 phút trước" },
    {
      user: "Trần Thị B",
      action: "bình luận về bài viết",
      time: "15 phút trước",
    },
    { user: "Lê Văn C", action: "đăng ký tài khoản", time: "30 phút trước" },
    { user: "Phạm Thị D", action: "gửi tin nhắn", time: "1 giờ trước" },
    {
      user: "Hoàng Văn E",
      action: "cập nhật thông tin cá nhân",
      time: "2 giờ trước",
    },
  ];

  const contentDistribution = [
    {
      label: "Bài viết",
      percentage: 65,
      color: "bg-blue-600",
      hoverColor: "group-hover:bg-blue-700",
      width: "w-[65%]",
    },
    {
      label: "Bình luận",
      percentage: 82,
      color: "bg-green-500",
      hoverColor: "group-hover:bg-green-600",
      width: "w-[82%]",
    },
    {
      label: "Tin nhắn",
      percentage: 45,
      color: "bg-yellow-500",
      hoverColor: "group-hover:bg-yellow-600",
      width: "w-[45%]",
    },
    {
      label: "Tương tác",
      percentage: 72,
      color: "bg-purple-500",
      hoverColor: "group-hover:bg-purple-600",
      width: "w-[72%]",
    },
  ];

  const userActivityData = [
    { day: "T1", value: 45, height: "h-20" },
    { day: "T2", value: 60, height: "h-28" },
    { day: "T3", value: 30, height: "h-16" },
    { day: "T4", value: 70, height: "h-32" },
    { day: "T5", value: 50, height: "h-24" },
    { day: "T6", value: 65, height: "h-30" },
    { day: "T7", value: 80, height: "h-36" },
  ];

  const topUsers = [
    {
      name: "Nguyễn Văn A",
      posts: 25,
      comments: 85,
    },
    {
      name: "Phạm Thị D",
      posts: 32,
      comments: 92,
    },
    {
      name: "Trần Thị B",
      posts: 14,
      comments: 32,
    },
    {
      name: "Lê Văn C",
      posts: 8,
      comments: 15,
    },
  ];

  return (
    <div className="w-full p-8 space-y-8 bg-gray-50">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex items-center cursor-pointer transition-all duration-300 
              hover:shadow-md ${
                activeCard === index
                  ? "ring-2 ring-blue-300 transform scale-[1.02]"
                  : "hover:transform hover:scale-[1.01]"
              }`}
            onClick={() => setActiveCard(activeCard === index ? null : index)}
          >
            <div
              className={`${stat.color} ${stat.hoverColor} ${stat.activeColor} text-white p-4 rounded-lg mr-4 
                flex items-center justify-center text-2xl transition-colors duration-300`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* User Activity Chart - Revised */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-5">User Activities</h2>
          <div className="h-64 flex items-end justify-between border-b border-l border-gray-200 px-4 pb-4">
            {userActivityData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 ${item.height} bg-blue-500 hover:bg-blue-600 rounded-t-md transition-colors duration-300 cursor-pointer min-h-[10px]`}
                ></div>
                <span className="text-xs mt-2">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500 px-4">
            <span>Last Week</span>
            <span>This Week</span>
          </div>
        </div>

        {/* Content Statistics */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">Content Distribution</h2>
          <div className="space-y-6 mt-3">
            {contentDistribution.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex justify-between mb-1">
                  <span>{item.label}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${item.color} ${item.hoverColor} h-2.5 rounded-full ${item.width} transition-colors duration-300`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">Recent Activities</h2>
          <div className="space-y-5">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-start border-b pb-4 cursor-pointer transition-all duration-300
                  hover:bg-gray-50 rounded-md py-2 ${
                    activeActivity === index ? "bg-blue-50" : ""
                  }`}
                onClick={() =>
                  setActiveActivity(activeActivity === index ? null : index)
                }
              >
                <div
                  className={`bg-blue-100 text-blue-800 p-2 rounded-full mr-3 
                  ${
                    activeActivity === index
                      ? "bg-blue-200 text-blue-900"
                      : "group-hover:bg-blue-200 group-hover:text-blue-900"
                  }`}
                >
                  <span role="img" aria-label="User icon">
                    👤
                  </span>
                </div>
                <div>
                  <p>
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 hover:text-blue-800 active:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded transition-colors duration-300">
            View all activities
          </button>
        </div>

        {/* Top Active Users */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">Top Users</h2>
          <div className="space-y-5">
            {topUsers.map((user, index) => (
              <div
                key={index}
                className={`flex items-center justify-between cursor-pointer transition-all duration-300
                  hover:bg-gray-50 rounded-md py-2 ${
                    activeUser === index ? "bg-blue-50" : ""
                  }`}
                onClick={() =>
                  setActiveUser(activeUser === index ? null : index)
                }
              >
                <div className="flex items-center">
                  <img
                    src={ava}
                    alt={user.name}
                    className={`w-10 h-10 rounded-full mr-3 transition-transform duration-300 
                      ${
                        activeUser === index
                          ? "ring-2 ring-blue-400 scale-110"
                          : "hover:scale-105"
                      }`}
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex text-sm text-gray-500 space-x-2">
                      <span>{user.posts} bài viết</span>
                      <span aria-hidden="true">•</span>
                      <span>{user.comments} bình luận</span>
                    </div>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 active:text-blue-900 hover:bg-blue-50 active:bg-blue-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-3 py-1">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
