import { FC, useState, useEffect } from "react";
import { Loader2, Send, X } from "lucide-react";
import {
  getAllCommentsForAdmin,
  updateCommentAsAdmin,
  deleteComment,
} from "../../../api/CommentRequest";

interface UserCommentsProps {
  userId: string;
}

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

const UserComments: FC<UserCommentsProps> = ({ userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

        if (userId) {
          const response = await getAllCommentsForAdmin(
            userId,
            currentPage,
            10
          );

          if (response.data && response.data.comments) {
            setComments(response.data.comments);
            setTotalPages(response.data.pagination.totalPages || 1);
          } else {
            setComments([]);
            setTotalPages(1);
          }
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
  }, [userId, currentPage]);

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
        userId: userId,
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

  const handleDelete = async (commentId: string) => {
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

  const confirmDelete = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDelete(commentId);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comments Made by User</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          This user hasn't made any comments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <h4 className="font-medium">
                  On:{" "}
                  <span className="text-blue-600">
                    {comment.postId && comment.postId.title
                      ? truncateText(comment.postId.title, 40)
                      : "Deleted Post"}
                  </span>
                </h4>
                <div className="flex space-x-2 items-center">
                  {comment.isEdited && (
                    <span className="text-xs text-gray-500">(edited)</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
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
                <>
                  <p className="text-gray-700 my-2">{comment.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                      ❤️ {comment.likes.length} likes
                    </div>
                    {!editingComment && (
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                          onClick={() => handleEdit(comment)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline hover:bg-red-50 px-2 py-1 rounded"
                          onClick={() => confirmDelete(comment._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
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
      )}
    </div>
  );
};

export default UserComments;
