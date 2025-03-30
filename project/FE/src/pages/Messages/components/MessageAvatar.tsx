interface MessageAvatarProps {
  avatar?: string;
  username: string;
}

function MessageAvatar({ avatar, username }: MessageAvatarProps) {
  const initials = username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className="w-full h-full rounded-full"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white">
          {initials}
        </div>
      )}
    </div>
  );
}

export default MessageAvatar;
