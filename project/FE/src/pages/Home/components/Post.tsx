import { Link } from "react-router-dom";
// import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import PostContent from "./PostContent";
import CommentBox from "./CommentBox";

import love from "@assets/images/emotion/love.png";

import ava from "@assets/images/ava.png";
import plusAddFriend from "@assets/images/plus-add-friend.png";
import loveIcon from "@assets/images/loveIcon.png";
import messageIcon from "@assets/images/icon-message.png";
import share from "@assets/images/share.png";
import { useSelector } from "react-redux";
import { likePost } from "@/actions/PostAction";
const Post = ({ data }: any) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState({
    addFriend: false,
    shareButton: false,
    commentButton: false,
  });

  const [showComments, setShowComments] = useState(false);

  const [postDate, setPostDate] = useState<Date>(
    new Date(data?.createdAt || Date.now())
  );

  const { user } = useSelector((state: any) => state.authReducer.authData);
  const [liked, setLiked] = useState(
    data?.likes ? data.likes.includes(user._id) : false
  );
  const [likes, setLikes] = useState(data?.likes ? data.likes.length : 0);

  // Lấy thông tin người đăng bài
  const [posterInfo, setPosterInfo] = useState<any>({
    id: typeof data?.userId === "string" ? data.userId : null,
    name: data?.name || "Người dùng",
    profilePic: null,
  });

  // Fetch thông tin người đăng bài
  useEffect(() => {
    const fetchPosterInfo = async () => {
      if (typeof data?.userId === "string") {
        try {
          const response = await axios.get(
            `http://localhost:3000/user/${data.userId}`
          );
          if (response.data) {
            setPosterInfo({
              id: data.userId,
              name: response.data.fullname || "Người dùng",
              profilePic: response.data.profilePic,
            });
          }
        } catch (err) {
          console.error("Error fetching poster info:", err);
        }
      }
    };

    fetchPosterInfo();
  }, [data?.userId]);

  // Kiểm tra trạng thái like
  useEffect(() => {
    if (data?.likes && user) {
      setLiked(data.likes.includes(user._id));
      setLikes(data.likes.length);
    }
  }, [data?.likes, user]);

  const formatDate = (date: Date): string => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      // Định dạng kiểu 'DD/MM/YYYY HH:MM'
      return date.toLocaleString("vi-VN", options);
    } catch (error) {
      console.error("Lỗi khi định dạng ngày:", error);
      return "Ngày không hợp lệ";
    }
  };

  const handleLike = () => {
    setLiked((prev: any) => !prev);
    if (data?._id && user?._id) {
      likePost(data._id, user._id);
    }
    liked
      ? setLikes((prev: any) => prev - 1)
      : setLikes((prev: any) => prev + 1);
  };

  const toggleComments = () => {
    setShowComments((prevState) => !prevState);
  };
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <div className="flex flex-col pt-3 pb-2 mb-2 bg-gray-50 border-1 border-[#DCDCDC] rounded-2xl shadow-lg m-auto hover:shadow-xl transition-shadow duration-300 max-w-[90%] w-full overflow-hidden">
      {/* Log dữ liệu đã được thực hiện trước khi render */}
      <div className="flex flex-col ml-7 max-w-full max-md:ml-2.5">
        <div className="flex gap-5 items-center w-full font-bold">
          <img
            src={
              posterInfo.profilePic
                ? serverPublic + posterInfo.profilePic
                : serverPublic + "defaultProfile.png"
            }
            className="object-cover shrink-0 self-stretch my-auto w-14 rounded-full aspect-square border-2 border-white shadow-md"
            alt="Post author avatar"
          />
          <div className="flex flex-col">
            <Link
              to={`/profile/${posterInfo.id}`}
              className="self-start text-xl leading-none !text-black hover:!underline"
            >
              {posterInfo.name}
            </Link>
            <div className="mt-2.5 text-base leading-none text-zinc-400">
              {formatDate(postDate)}
            </div>
          </div>
        </div>
        <PostContent text={data?.content || ""} />
      </div>
      <img
        src={
          data?.image
            ? data.image.startsWith("http")
              ? data.image
              : import.meta.env.VITE_PUBLIC_FOLDER + data.image
            : null
        }
        className="w-full max-h-[500px] mt-2 object-contain hover:opacity-95 transition-opacity duration-300 rounded-md"
        alt="Post image content"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = ava;
          target.onerror = null;
        }}
      />
      <div className="flex flex-wrap gap-8 items-center self-center mt-1 max-w-full w-[703px] py-2">
        <div
          className="flex items-center m-auto cursor-pointer gap-4"
          onClick={handleLike}
        >
          <img
            src={liked ? love : loveIcon}
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.2] w-[48px] transition-transform duration-300 hover:scale-110"
            alt="Like button icon"
          />
          <div className="text-sm text-gray-500">{likes}</div>
        </div>

        <div
          className="items-center m-auto gap-2 cursor-pointer group"
          onClick={toggleComments}
          onMouseEnter={() =>
            setIsHovered((prev) => ({ ...prev, commentButton: true }))
          }
          onMouseLeave={() =>
            setIsHovered((prev) => ({ ...prev, commentButton: false }))
          }
        >
          <img
            src={messageIcon}
            className={`object-contain shrink-0 aspect-[1.25] w-[48px] transition-transform duration-300 ${
              isHovered.commentButton ? "scale-110" : ""
            }`}
            alt="Comment button icon"
          />
        </div>
        <div
          className="items-center m-auto gap-2 cursor-pointer group"
          onMouseEnter={() =>
            setIsHovered((prev) => ({ ...prev, shareButton: true }))
          }
          onMouseLeave={() =>
            setIsHovered((prev) => ({ ...prev, shareButton: false }))
          }
        >
          <img
            src={share}
            className={`object-contain shrink-0 aspect-[1.31] w-[48px] transition-transform duration-300 ${
              isHovered.shareButton ? "scale-110" : ""
            }`}
            alt="Share button icon"
          />
        </div>
      </div>
      {showComments && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <CommentBox />
        </div>
      )}
    </div>
  );
};
export default Post;
