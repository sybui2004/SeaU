import { Link } from "react-router-dom";
// import Skeleton from "react-loading-skeleton";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import PostContent from "./PostContent";
import CommentBox from "./CommentBox";

import laugh from "@assets/images/emotion/laugh.png";
import angry from "@assets/images/emotion/angry.png";
import sad from "@assets/images/emotion/sad.png";
import like from "@assets/images/emotion/like.png";
import love from "@assets/images/emotion/love.png";

import ava from "@assets/images/ava.png";
import plusAddFriend from "@assets/images/plus-add-friend.png";
import demo from "@assets/images/demo.png";
import likeIcon from "@assets/images/likeIcon.png";
import messageIcon from "@assets/images/icon-message.png";
import share from "@assets/images/share.png";

type EmoteType = "like" | "love" | "laugh" | "sad" | "angry";
type EmotesMap = Record<EmoteType, string>;

const emotes: EmotesMap = { like, love, laugh, sad, angry };

const Post = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState({
    addFriend: false,
    likeButton: false,
    shareButton: false,
    commentButton: false,
  });

  const [showComments, setShowComments] = useState(false);
  const [showEmotes, setShowEmotes] = useState(false);
  const [selectedEmote, setSelectedEmote] = useState<EmoteType | null>(null);
  const emoteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [postDate, setPostDate] = useState<Date>(new Date());

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 200);

  //   return () => clearTimeout(timer);
  // }, []);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const handleLikeHover = () => {
    setIsHovered((prev) => ({ ...prev, likeButton: true }));
    if (emoteTimeoutRef.current) {
      clearTimeout(emoteTimeoutRef.current);
      emoteTimeoutRef.current = null;
    }
    setShowEmotes(true);
  };

  const handleEmotesLeave = () => {
    emoteTimeoutRef.current = setTimeout(() => {
      setShowEmotes(false);
      setIsHovered((prev) => ({ ...prev, likeButton: false }));
    }, 300);
  };

  const handleEmotesEnter = () => {
    if (emoteTimeoutRef.current) {
      clearTimeout(emoteTimeoutRef.current);
      emoteTimeoutRef.current = null;
    }
  };

  const handleEmoteClick = (emoteName: EmoteType) => {
    if (selectedEmote === emoteName) {
      setSelectedEmote(null);
    } else {
      setSelectedEmote(emoteName);
    }
    setShowEmotes(false);
    console.log(
      `Reaction ${
        selectedEmote === emoteName ? "removed" : `set to: ${emoteName}`
      }`
    );
  };

  useEffect(() => {
    return () => {
      if (emoteTimeoutRef.current) {
        clearTimeout(emoteTimeoutRef.current);
      }
    };
  }, []);

  const toggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  const getCurrentEmoteIcon = () => {
    if (selectedEmote) {
      return emotes[selectedEmote];
    }
    return likeIcon;
  };

  return (
    <div className="flex flex-col pt-3 pb-2 bg-gray-50 border-1 border-[#DCDCDC] rounded-2xl shadow-lg m-auto hover:shadow-xl transition-shadow duration-300 max-w-[90%] overflow-hidden">
      <div className="flex flex-col ml-7 max-w-full max-md:ml-2.5">
        <div className="flex gap-5 items-center w-full font-bold">
          <img
            src={ava}
            className="object-contain shrink-0 self-stretch my-auto w-14 rounded-full aspect-square border-2 border-white shadow-md"
            alt="Post author avatar"
          />
          <div className="flex flex-col">
            {/* {isLoading ? (
              <Skeleton width={100} height={24} />
            ) : ( */}
            <Link
              to="/my-love/profile"
              className="self-start text-xl leading-none !text-black hover:!underline"
            >
              My love
            </Link>
            {/* )} */}
            <div className="mt-2.5 text-base leading-none text-zinc-400">
              {formatDate(postDate)}
            </div>
          </div>
          <Button
            variant="gradientCustom"
            className={`flex items-center gap-2 px-3 py-3 mt-1.5 h-full text-base leading-loose text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)] transition-all duration-300 ${
              isHovered.addFriend ? "shadow-lg scale-105" : ""
            } cursor-pointer`}
            onMouseEnter={() =>
              setIsHovered((prev) => ({ ...prev, addFriend: true }))
            }
            onMouseLeave={() =>
              setIsHovered((prev) => ({ ...prev, addFriend: false }))
            }
          >
            <img
              src={plusAddFriend}
              className={`object-contain shrink-0 aspect-[1.2] w-[30px] transition-transform duration-300 ${
                isHovered.addFriend ? "scale-110" : ""
              }`}
              alt="Add friend icon"
            />
            <div>Add friend</div>
          </Button>
        </div>
        <PostContent
          text="On weekends, my family and I enjoy spending time together. Saturday mornings usually start with a big breakfast at home. My mom makes pancakes or waffles, and we all sit around the table chatting about our plans for the day. Sometimes we decide to go hiking in the nearby forest. It's peaceful and beautiful there, with tall trees and birds chirping.

In the afternoons, if the weather is nice, we might have a picnic in the park. We bring sandwiches, fruit, and lemonade. We play games like Frisbee or soccer. It's a great way to relax and enjoy each other's company.

On Sundays, we often visit my grandparents. They live in a cozy house by the lake. My grandma is an amazing cook, and she always prepares a delicious lunch for us. We help her set the table and then enjoy a hearty meal together. After lunch, we take a walk around the lake or sit on the porch chatting and watching the sunset.

Evenings are for winding down. We might watch a movie together or play board games. It's these simple moments that make our weekends special. I cherish the time I get to spend with my family—it's when we create lasting memories and strengthen our bond."
        />
      </div>
      <img
        src={demo}
        className="object-cover mt-2 w-full aspect-[1.5] max-md:max-w-full hover:opacity-95 transition-opacity duration-300 rounded-md"
        alt="Post image content"
      />
      <div className="flex flex-wrap gap-8 items-center self-center mt-1 max-w-full w-[703px] py-2">
        <div
          className="relative items-center m-auto gap-2 cursor-pointer group"
          onMouseEnter={handleLikeHover}
          onMouseLeave={handleEmotesLeave}
        >
          <img
            src={getCurrentEmoteIcon()}
            className={`object-contain shrink-0 self-stretch my-auto aspect-[1.2] w-[48px] transition-transform duration-300 ${
              isHovered.likeButton ? "scale-110" : ""
            }`}
            alt="Like button icon"
          />

          {/* Popup emotions */}
          {showEmotes && (
            <div
              className="absolute -top-16 left-20 transform -translate-x-1/2 flex gap-3 w-76 bg-white rounded-full p-2 shadow-lg z-10"
              onMouseEnter={handleEmotesEnter}
              onMouseLeave={handleEmotesLeave}
            >
              {Object.entries(emotes).map(([key, src]) => (
                <img
                  key={key}
                  src={src}
                  className="w-10 h-10 ml-2 cursor-pointer hover:scale-125 transition-transform duration-200"
                  alt={`${key} reaction`}
                  onClick={() => handleEmoteClick(key as EmoteType)}
                />
              ))}
            </div>
          )}
        </div>
        <div
          className="items-center m-auto  gap-2 cursor-pointer group"
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
          className="items-center m-auto  gap-2 cursor-pointer group"
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
