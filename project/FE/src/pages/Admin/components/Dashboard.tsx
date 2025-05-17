import { FC, useState, useEffect } from "react";
import ava from "@assets/images/ava.png";
import { getDashboardStats, getTopUsers } from "@/api/UserRequest";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  totalPosts: number;
  lastUpdated: string;
}

interface TopUser {
  _id: string;
  fullname: string;
  username: string;
  profilePic?: string;
  postsCount: number;
  commentsCount: number;
}

const Dashboard: FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const serverPublic =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return ava;

    if (imagePath.startsWith("/images/")) {
      return `${serverPublic.replace("/images/", "")}${imagePath}`;
    }

    return `${serverPublic}${imagePath}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const statsResponse = await getDashboardStats();
        console.log("Dashboard stats:", statsResponse.data);
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }

        const usersResponse = await getTopUsers(5, "posts");
        if (usersResponse.data && usersResponse.data.users) {
          const sortedUsers = [...usersResponse.data.users].sort((a, b) => {
            const postsDiff = (b.postsCount || 0) - (a.postsCount || 0);
            if (postsDiff !== 0) return postsDiff;
            return (b.commentsCount || 0) - (a.commentsCount || 0);
          });
          console.log("Sorted users:", sortedUsers);
          setTopUsers(sortedUsers);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      icon: "👥",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      activeColor: "active:bg-blue-700",
    },
    {
      title: "New Users",
      value: stats?.newUsers?.toLocaleString() || "0",
      icon: "🆕",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      activeColor: "active:bg-green-700",
    },
    {
      title: "Total Posts",
      value: stats?.totalPosts?.toLocaleString() || "0",
      icon: "📝",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      activeColor: "active:bg-purple-700",
    },
  ];

  return (
    <div className="w-full p-8 space-y-8 bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex items-center cursor-pointer transition-all duration-300 
                  hover:shadow-md ${
                    activeCard === index
                      ? "ring-2 ring-blue-300 transform scale-[1.02]"
                      : "hover:transform hover:scale-[1.01]"
                  }`}
                onClick={() =>
                  setActiveCard(activeCard === index ? null : index)
                }
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

          {/* Top Active Users */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-5">Top Users</h2>
            {topUsers.length > 0 ? (
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
                        src={getImageUrl(user.profilePic)}
                        alt={user.fullname}
                        className={`w-10 h-10 rounded-full mr-3 transition-transform duration-300 object-cover
                          ${
                            activeUser === index
                              ? "ring-2 ring-blue-400 scale-110"
                              : "hover:scale-105"
                          }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = ava;
                        }}
                      />
                      <div>
                        <p className="font-medium">{user.fullname}</p>
                        <div className="flex text-sm text-gray-500 space-x-2">
                          <span>{user.postsCount || 0} posts</span>
                          <span aria-hidden="true">•</span>
                          <span>{user.commentsCount || 0} comments</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 active:text-blue-900 hover:bg-blue-50 active:bg-blue-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-3 py-1"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No data users</p>
            )}
          </div>

          {/* Show last updated time */}
          {stats?.lastUpdated && (
            <div className="text-right text-xs text-gray-500 mt-4">
              Last updated:{" "}
              {new Date(stats.lastUpdated).toLocaleString("en-US")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
