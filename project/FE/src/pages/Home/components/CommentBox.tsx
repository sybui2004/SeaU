import { useState } from "react";
import ava from "@assets/images/ava.png";
import sentIcon from "@assets/images/icon-sent.png";
import { Button } from "@/components/ui/button";
interface User {
  name: string;
  avatar: string;
}

interface CommentItem {
  id: number;
  user: User;
  text: string;
  timestamp: string;
  parentId: number | null;
  replies: number[];
}

const CommentBox = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const [commentItems, setCommentItems] = useState<Record<number, CommentItem>>(
    {
      1: {
        id: 1,
        user: {
          name: "John Doe",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        text: "Tuyệt vời! Tôi rất thích nội dung này.",
        timestamp: "2 giờ trước",
        parentId: null,
        replies: [3],
      },
      2: {
        id: 2,
        user: {
          name: "Jane Smith",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        text: "Cảm ơn vì đã chia sẻ thông tin hữu ích!",
        timestamp: "3 giờ trước",
        parentId: null,
        replies: [],
      },
      3: {
        id: 3,
        user: {
          name: "Alex Johnson",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        text: "Tôi cũng đồng ý! Nội dung rất chi tiết.",
        timestamp: "1 giờ trước",
        parentId: 1,
        replies: [4],
      },
      4: {
        id: 4,
        user: {
          name: "Maria Garcia",
          avatar: "https://i.pravatar.cc/150?img=4",
        },
        text: "Phần kết luận là phần tôi thích nhất.",
        timestamp: "30 phút trước",
        parentId: 3,
        replies: [],
      },
    }
  );

  const topLevelComments = Object.values(commentItems).filter(
    (item) => item.parentId === null
  );

  const PREVIEW_COMMENT_COUNT = 3;

  const visibleComments = showAllComments
    ? topLevelComments
    : topLevelComments.slice(0, PREVIEW_COMMENT_COUNT);

  const addNewComment = () => {
    if (commentText.trim() !== "") {
      const newId = Date.now();
      const newComment: CommentItem = {
        id: newId,
        user: {
          name: "Current User",
          avatar: ava,
        },
        text: commentText.trim(),
        timestamp: "Vừa xong",
        parentId: null,
        replies: [],
      };

      setCommentItems((prev) => ({
        ...prev,
        [newId]: newComment,
      }));
      setCommentText("");
    }
  };

  const handleSubmitComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewComment();
    }
  };

  const toggleCommentVisibility = () => {
    setShowAllComments(!showAllComments);
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  const addNewReply = (parentCommentId: number) => {
    if (replyText.trim() !== "") {
      const newId = Date.now();
      const newReply: CommentItem = {
        id: newId,
        user: {
          name: "Current User",
          avatar: ava,
        },
        text: replyText.trim(),
        timestamp: "Vừa xong",
        parentId: parentCommentId,
        replies: [],
      };

      const updatedItems = {
        ...commentItems,
        [newId]: newReply,
      };

      updatedItems[parentCommentId] = {
        ...updatedItems[parentCommentId],
        replies: [...updatedItems[parentCommentId].replies, newId],
      };

      setCommentItems(updatedItems);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleSubmitReply = (
    e: React.KeyboardEvent<HTMLInputElement>,
    commentId: number
  ) => {
    if (e.key === "Enter") {
      addNewReply(commentId);
    }
  };

  const getIndentClass = (depth: number) => {
    const level = Math.min(depth + 1, 4);

    switch (level) {
      case 1:
        return "pl-4 ml-2";
      case 2:
        return "pl-8 ml-2";
      case 3:
        return "pl-12 ml-2";
      case 4:
        return "pl-16 ml-2";
      default:
        return "pl-4 ml-2";
    }
  };

  const CommentThread = ({
    commentId,
    depth = 0,
  }: {
    commentId: number;
    depth?: number;
  }) => {
    const comment = commentItems[commentId];
    const maxDepth = 5;

    if (!comment) return null;

    return (
      <div className="flex flex-col gap-3">
        {/* Comment */}
        <div className="flex gap-3 items-start">
          <img
            src={comment.user.avatar}
            className="object-contain shrink-0 w-10 h-10 rounded-full aspect-square border border-white shadow-sm"
            alt={`${comment.user.name}'s avatar`}
          />
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800">
                  {comment.user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
            <div className="mt-1 ml-2 flex gap-4 text-sm">
              <button className="text-gray-500 hover:text-blue-500">
                Like
              </button>
              <button
                className="text-gray-500 hover:text-blue-500"
                onClick={() => handleReplyClick(comment.id)}
              >
                Reply
              </button>
            </div>
          </div>
        </div>

        {/* Reply input */}
        {replyingTo === comment.id && (
          <div
            className={`flex items-center gap-2 pl-${
              Math.min(depth + 1, 4) * 3
            }`}
          >
            <img
              src={ava}
              className="object-contain shrink-0 w-8 h-8 rounded-full aspect-square border border-white shadow-sm"
              alt="Current user avatar"
            />
            <div className="flex-1 flex items-center bg-zinc-200 rounded-3xl px-4 py-2">
              <input
                type="text"
                placeholder="Viết phản hồi..."
                className="flex-grow bg-transparent outline-none text-sm"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => handleSubmitReply(e, comment.id)}
                autoFocus
              />
              <button
                onClick={() => addNewReply(comment.id)}
                className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-200"
                aria-label="Submit reply"
              >
                <img className="h-5" src={sentIcon} alt="Send reply" />
              </button>
            </div>
          </div>
        )}

        {depth < maxDepth && comment.replies.length > 0 && (
          <div
            className={`${getIndentClass(
              depth
            )} space-y-3 border-l-2 border-gray-200`}
          >
            {comment.replies.map((replyId) => (
              <CommentThread
                key={replyId}
                commentId={replyId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[80%] mx-auto mt-6">
      {/* Comment Input */}
      <div className="flex flex-wrap items-center gap-3 self-center h-10 mt-4 w-full text-xl leading-none whitespace-nowrap text-stone-400">
        <img
          src={ava}
          className="object-contain shrink-0 self-start w-12 rounded-full aspect-square border-2 border-white shadow-md"
          alt="Current user avatar"
        />
        <div
          className={`flex items-center justify-between overflow-hidden grow shrink-0 px-7 py-5 h-full rounded-3xl border border-solid basis-0 bg-zinc-200 transition-all duration-300 ${
            isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
          } w-fit max-md:px-5 max-md:max-w-full cursor-text`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <input
            type="text"
            placeholder="Comment..."
            className="flex-grow bg-transparent outline-none mr-4"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleSubmitComment}
          />
          <Button
            variant="ghost"
            onClick={addNewComment}
            className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-200 pl-2 -mr-4"
            aria-label="Submit comment"
          >
            <img className="h-7" src={sentIcon} alt="Sent comment" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Comment ({Object.keys(commentItems).length})
          </h3>
          {topLevelComments.length > PREVIEW_COMMENT_COUNT && (
            <button
              onClick={toggleCommentVisibility}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              {showAllComments ? "Show less" : "Show all"}
            </button>
          )}
        </div>

        {/* Render comment threads */}
        <div className="space-y-6">
          {visibleComments.map((comment) => (
            <CommentThread key={comment.id} commentId={comment.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
