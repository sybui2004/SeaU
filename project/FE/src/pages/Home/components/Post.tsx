import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import CommentBox from "./CommentBox";
import love from "@assets/images/emotion/love.png";
import ava from "@assets/images/ava.png";
import loveIcon from "@assets/images/loveIcon.png";
import messageIcon from "@assets/images/icon-message.png";
import share from "@assets/images/share.png";
import { useSelector, useDispatch } from "react-redux";
import { likePost } from "@/actions/PostAction";
import { getUser } from "@/api/UserRequest";
import { format } from "timeago.js";

const Post = ({ data }: any) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState({
    addFriend: false,
    shareButton: false,
    commentButton: false,
  });

  const [showComments, setShowComments] = useState(false);

  const postDate = new Date(data?.createdAt || Date.now());

  const { user } = useSelector((state: any) => state.authReducer.authData);
  const [liked, setLiked] = useState(
    data?.likes ? data.likes.includes(user._id) : false
  );
  const [likes, setLikes] = useState(data?.likes ? data.likes.length : 0);

  const [posterInfo, setPosterInfo] = useState<any>({
    id: typeof data?.userId === "string" ? data.userId : null,
    name: data?.name || "User",
    profilePic: null,
  });

  useEffect(() => {
    const fetchPosterInfo = async () => {
      if (typeof data?.userId === "string") {
        try {
          const response = await getUser(data.userId as string);
          if (response.data) {
            setPosterInfo({
              id: data.userId,
              name: response.data.fullname || "User",
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

  useEffect(() => {
    if (data?.likes && user) {
      setLiked(data.likes.includes(user._id));
      setLikes(data.likes.length);
    }
  }, [data?.likes, user]);

  const handleLike = () => {
    setLiked((prev: any) => !prev);
    if (data?._id && user?._id) {
      dispatch(likePost(data._id, user._id) as any);
    }
    liked
      ? setLikes((prev: any) => prev - 1)
      : setLikes((prev: any) => prev + 1);
  };

  const toggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  const serverBaseUrl =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";
  const serverPublic = serverBaseUrl.endsWith("/images/")
    ? serverBaseUrl.substring(0, serverBaseUrl.length - 8)
    : serverBaseUrl.endsWith("/images")
    ? serverBaseUrl.substring(0, serverBaseUrl.length - 7)
    : serverBaseUrl;

  const getImageUrl = (imagePath: string | null): string => {
    if (!imagePath) {
      return ava;
    }

    console.log("Getting image URL for:", imagePath);

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

    if (normalizedPath.startsWith("/images/")) {
      const baseUrl = serverPublic.endsWith("/")
        ? serverPublic.slice(0, -1)
        : serverPublic;

      const fullUrl = `${baseUrl}${normalizedPath}`;
      console.log("Constructed URL (with /images/):", fullUrl);
      return fullUrl;
    }

    const baseUrl = serverPublic.endsWith("/")
      ? `${serverPublic}images`
      : `${serverPublic}/images`;

    const fullUrl = `${baseUrl}${
      normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`
    }`;
    console.log("Constructed URL (adding /images/):", fullUrl);
    return fullUrl;
  };

  return (
    <div className="flex flex-col pt-3 pb-2 mb-2 bg-gray-50 border-1 border-[#DCDCDC] rounded-2xl shadow-lg m-auto hover:shadow-xl transition-shadow duration-300 max-w-[90%] w-full overflow-hidden">
      <div className="flex flex-col ml-7 max-w-full max-md:ml-2.5">
        <div className="flex gap-5 items-center w-full font-bold">
          <img
            src={getImageUrl(posterInfo.profilePic)}
            className="object-cover shrink-0 self-stretch my-auto w-14 rounded-full aspect-square border-2 border-white shadow-md"
            alt="Post author avatar"
            onError={(e) => {
              console.error(
                "Failed to load profile image:",
                posterInfo.profilePic
              );
              const target = e.target as HTMLImageElement;
              target.src = ava;
              target.onerror = null;
            }}
          />
          <div className="flex flex-col">
            <Link
              to={`/profile/${posterInfo.id}`}
              className="self-start text-xl leading-none !text-black hover:!underline"
            >
              {posterInfo.name}
            </Link>
            <div className="mt-2.5 text-base leading-none text-zinc-400">
              {format(postDate)}
            </div>
          </div>
        </div>
        <PostContent text={data?.content || ""} />
      </div>

      {data?.image && (
        <div className="relative">
          <img
            src={getImageUrl(data.image)}
            className="w-full max-h-[500px] mt-2 object-contain hover:opacity-95 transition-opacity duration-300 rounded-md"
            alt="Post image content"
            onError={(e) => {
              console.error("Failed to load post image:", data.image);
              const target = e.target as HTMLImageElement;

              const errorDiv = document.createElement("div");
              errorDiv.className =
                "p-4 bg-red-50 text-red-700 mt-2 text-sm break-all";
              errorDiv.innerHTML = `
                <p><strong>Image failed to load</strong></p>
                <p>Path: ${data.image}</p>
                <p>Full URL: ${getImageUrl(data.image)}</p>
                <p>Server URL: ${serverPublic}</p>
              `;
              target.parentNode?.appendChild(errorDiv);

              target.style.display = "none";
              target.onerror = null;
            }}
          />
        </div>
      )}

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
