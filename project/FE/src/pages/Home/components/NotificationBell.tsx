import { useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      text: "Bạn có một tin nhắn mới",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      text: "Đơn hàng #12345 đã được giao",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 3,
      text: "Có sự kiện mới vào ngày mai",
      time: "1 ngày trước",
      read: true,
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

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        className="relative p-2 text-gray-600 transition-colors duration-200 rounded-full hover:text-cyan-500 focus:outline-none"
        onClick={toggleNotifications}
      >
        <Bell size={32} />

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown for Notifications */}
      {isOpen && (
        <div className="absolute -right-8 z-10 w-80 mt-2 bg-white rounded-md shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notification</h3>
            {unreadCount > 0 && (
              <button
                className="text-sm text-cyan-500 hover:text-cyan-700"
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
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{notification.text}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notification
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
