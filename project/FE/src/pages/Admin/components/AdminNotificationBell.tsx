import { useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
  type?: "user" | "post" | "comment" | "system";
}

const AdminNotificationBell = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      text: "Người dùng mới vừa đăng ký: Nguyễn Văn A",
      time: "5 phút trước",
      read: false,
      type: "user",
    },
    {
      id: 2,
      text: "Bài viết mới cần phê duyệt",
      time: "30 phút trước",
      read: false,
      type: "post",
    },
    {
      id: 3,
      text: "3 bình luận mới cần kiểm duyệt",
      time: "2 giờ trước",
      read: false,
      type: "comment",
    },
    {
      id: 4,
      text: "Báo cáo thống kê hàng tuần đã sẵn sàng",
      time: "1 ngày trước",
      read: true,
      type: "system",
    },
    {
      id: 5,
      text: "Trần Thị B đã cập nhật thông tin cá nhân",
      time: "2 ngày trước",
      read: true,
      type: "user",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = (): void => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: number): void => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = (): void => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "user":
        return "👤";
      case "post":
        return "📝";
      case "comment":
        return "💬";
      case "system":
        return "🔧";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case "user":
        return "bg-blue-100 text-blue-800";
      case "post":
        return "bg-purple-100 text-purple-800";
      case "comment":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={toggleNotifications}
        aria-label="Thông báo"
        title="Xem thông báo"
      >
        <Bell size={22} className="text-gray-700" />

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown for Notifications */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-80 mt-2 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">Notification</h3>
            {unreadCount > 0 && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                      !notification.read ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 mr-3 rounded-full ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        <span className="text-sm">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "font-semibold"
                                : "font-medium"
                            }`}
                          >
                            {notification.text}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 mt-1 ml-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-3 text-center border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell;
