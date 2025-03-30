import MessageAvatar from "./MessageAvatar";

interface MessageListItemProps {
  avatar?: string;
  username: string;
  message: string;
  time: string;
  unread?: number;
}

function MessageListItem({
  avatar,
  username,
  message,
  time,
  unread,
}: MessageListItemProps) {
  return (
    <div className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
      {/* Avatar */}
      <MessageAvatar avatar={avatar} username={username} />

      {/* Nội dung tin nhắn */}
      <div className="flex flex-col ml-3 flex-1">
        {/* Hàng chứa username và time */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm flex-1 truncate">
            {username}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>

        {/* Hàng chứa message và unread */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate flex-1">{message}</p>
          {unread ? (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
              {unread}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MessageListItem;
