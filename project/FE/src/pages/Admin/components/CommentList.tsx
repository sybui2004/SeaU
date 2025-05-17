import { FC, useState, useEffect } from "react";
import searchIcon from "@assets/images/icon-search.png";
import defaultAvatar from "@assets/images/ava.png";
import { Loader2, Send, X } from "lucide-react";
import {
  getAllCommentsForAdminDashboard,
  updateCommentAsAdmin,
  deleteComment,
} from "@/api/CommentRequest";

interface Comment {
  _id: string;
  postId: {
    _id: string;
    title: string;
    content: string;
  };
  userId: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
  content: string;
  likes: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
}

const CommentList: FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const serverPublic =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllCommentsForAdminDashboard(
          currentPage,
          10,
          searchQuery
        );

        if (response.data && response.data.comments) {
          setComments(response.data.comments);
          setTotalPages(response.data.pagination.totalPages || 1);
        } else {
          setComments([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(
          "An error occurred while fetching comments. Please try again later."
        );
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentPage, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Today, ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditText(comment.content);
  };

  const handleUpdate = async () => {
    if (!editingComment) return;

    try {
      const response = await updateCommentAsAdmin(editingComment._id, {
        userId: editingComment.userId._id,
        content: editText,
      });

      if (response.data && response.data.data) {
        setComments(
          comments.map((cmt) =>
            cmt._id === editingComment._id
              ? { ...cmt, content: editText, isEdited: true }
              : cmt
          )
        );
        setEditingComment(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleDelete = async (commentId: string, userId: string) => {
    try {
      const response = await deleteComment(commentId, userId, true);

      if (response.data) {
        setComments(comments.filter((cmt) => cmt._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const confirmDelete = (commentId: string, userId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDelete(commentId, userId);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getProfilePic = (comment: Comment) => {
    if (!comment.userId?.profilePic) return defaultAvatar;
    if (comment.userId.profilePic.startsWith("http"))
      return comment.userId.profilePic;
    return `${serverPublic}/${comment.userId.profilePic}`;
  };

  const filteredComments = comments.filter((comment) => {
    return (
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.userId.fullname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (comment.postId &&
        comment.postId.title &&
        comment.postId.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Comment List</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <div
            className={`flex overflow-hidden items-center w-64 h-12 px-4 leading-none rounded-3xl border border-solid bg-zinc-100 transition-all duration-300 ${
              isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
            } text-zinc-900 max-md:px-5 max-md:max-w-full`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={searchIcon}
              alt="Search icon"
              className={`object-contain shrink-0 w-[16px] mr-1 transition-transform duration-300 ${
                isHovered ? "scale-110" : ""
              }`}
            />
            <input
              type="text"
              placeholder="Search comment..."
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search comment"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment._id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <img
                      src={getProfilePic(comment)}
                      alt={comment.userId.fullname}
                      className="w-10 h-10 rounded-full mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultAvatar;
                      }}
                    />
                    <div>
                      <div className="font-medium">
                        {comment.userId.fullname}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  {comment.isEdited && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Edited
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-sm text-blue-600 mb-2">
                    Comment about:{" "}
                    <span className="font-medium">
                      {comment.postId && comment.postId.title
                        ? comment.postId.title
                        : "Deleted Post"}
                    </span>
                  </div>

                  {editingComment && editingComment._id === comment._id ? (
                    <div className="mt-3">
                      <textarea
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        aria-label="Edit comment text"
                        placeholder="Enter your comment..."
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-100"
                          onClick={() => setEditingComment(null)}
                        >
                          <X size={16} className="inline mr-1" />
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={handleUpdate}
                          disabled={!editText.trim()}
                        >
                          <Send size={16} className="inline mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-1">❤️</span> {comment.likes.length}{" "}
                    likes
                  </div>
                  {!editingComment && (
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                        onClick={() => handleEdit(comment)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline hover:bg-red-50 px-2 py-1 rounded"
                        onClick={() =>
                          confirmDelete(comment._id, comment.userId._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-3 py-1 mx-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No comments found that match the filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
