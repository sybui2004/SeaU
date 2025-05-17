import { FC, useState, useEffect, useRef } from "react";
import { Loader2, X, Upload } from "lucide-react";
import {
  getAllPostsForAdmin,
  deletePostAsAdmin,
  updatePostAsAdmin,
  updatePostWithImage,
} from "@/api/PostRequest";
import searchIcon from "@assets/images/icon-search.png";
import defaultAvatar from "@/assets/images/ava.png";

interface Post {
  _id: string;
  title: string;
  content: string;
  userId: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
  createdAt: string;
  updatedAt: string;
  image?: string;
}

interface PaginationData {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const PostList: FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    totalPosts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serverPublic =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPostsForAdmin(page, 10, searchQuery);

      if (response.data) {
        setPosts(response.data.posts || []);
        setPagination(
          response.data.pagination || {
            totalPosts: 0,
            totalPages: 1,
            currentPage: page,
            limit: 10,
          }
        );
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostAsAdmin(postId);
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

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

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return defaultAvatar;

    console.log("Original image path:", imagePath);

    let url;
    if (imagePath.startsWith("/images/")) {
      url = `${serverPublic.replace("/images/", "")}${imagePath}`;
    } else {
      url = `${serverPublic}${imagePath}`;
    }

    console.log("Constructed image URL:", url);
    return url;
  };

  const getPostImageUrl = (
    imagePath: string | undefined
  ): string | undefined => {
    if (!imagePath) return undefined;

    let url;
    if (imagePath.startsWith("/images/")) {
      url = `${serverPublic.replace("/images/", "")}${imagePath}`;
    } else {
      url = `${serverPublic}${imagePath}`;
    }

    return url;
  };

  const handleViewPost = (post: Post) => {
    setViewPost(post);
  };

  const handleEditPost = (post: Post) => {
    setEditPost(post);
    setEditContent(post.content);
    setSelectedImage(null);
    setImagePreview(post.image ? getPostImageUrl(post.image) : undefined);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name, file.type, file.size);
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log("Image preview created");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (editPost?.image) {
      setImagePreview(getPostImageUrl(editPost.image));
    } else {
      setImagePreview(undefined);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdatePost = async () => {
    if (!editPost) return;

    try {
      setIsUpdating(true);

      if (selectedImage) {
        console.log("Updating post with new image:", selectedImage.name);

        const formData = new FormData();
        formData.append("userId", editPost.userId._id);
        formData.append("content", editContent);
        formData.append("image", selectedImage);
        formData.append("isAdmin", "true");

        console.log(
          "FormData created with fields:",
          Array.from(formData.entries()).map(
            (entry) =>
              `${entry[0]}: ${entry[0] === "image" ? "File" : entry[1]}`
          )
        );

        const response = await updatePostWithImage(editPost._id, formData);
        console.log("Update response:", response.data);

        if (response.data) {
          setPosts(
            posts.map((post) =>
              post._id === editPost._id
                ? {
                    ...post,
                    content: editContent,
                    image: response.data.image || post.image,
                  }
                : post
            )
          );
          setEditPost(null);
          setSelectedImage(null);
          setImagePreview(undefined);
        }
      } else {
        const response = await updatePostAsAdmin(editPost._id, {
          content: editContent,
        });

        if (response.data) {
          setPosts(
            posts.map((post) =>
              post._id === editPost._id
                ? { ...post, content: editContent }
                : post
            )
          );
          setEditPost(null);
          setSelectedImage(null);
          setImagePreview(undefined);
        }
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Post List</h2>
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
              placeholder="Search post..."
              className="flex-grow bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts found</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.content
                          ? post.content.length > 20
                            ? post.content.substring(0, 20) + "..."
                            : post.content
                          : "(No content)"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={getImageUrl(post.userId?.profilePic)}
                            alt={post.userId?.fullname || "User"}
                            onError={(e) => {
                              console.log("Image load error, using default");
                              const target = e.target as HTMLImageElement;
                              target.src = defaultAvatar;
                            }}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {post.userId?.fullname || "Unknown User"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                          onClick={() => handleViewPost(post)}
                          aria-label="View post"
                          title="View post"
                        >
                          View
                        </button>
                        <button
                          className="p-1 text-green-600 hover:underline hover:bg-green-50 px-2 py-1 rounded"
                          onClick={() => handleEditPost(post)}
                          aria-label="Edit post"
                          title="Edit post"
                        >
                          Edit
                        </button>
                        <button
                          className="p-1 text-red-600 hover:underline hover:bg-red-50 px-2 py-1 rounded"
                          onClick={() => handleDeletePost(post._id)}
                          aria-label="Delete post"
                          title="Delete post"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="px-3 py-1 mx-1">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mx-1 disabled:opacity-50"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Post Modal */}
      {viewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">View Post</h3>
              <button
                onClick={() => setViewPost(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 flex items-center">
              <img
                src={getImageUrl(viewPost.userId?.profilePic)}
                alt={viewPost.userId?.fullname || "User"}
                className="w-10 h-10 rounded-full object-cover mr-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultAvatar;
                }}
              />
              <div>
                <p className="font-medium">
                  {viewPost.userId?.fullname || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(viewPost.createdAt)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {viewPost.content}
              </p>
            </div>

            {viewPost.image && (
              <div className="mb-4">
                <img
                  src={getPostImageUrl(viewPost.image) as string}
                  alt="Post image"
                  className="max-w-full rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setViewPost(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Post</h3>
              <button
                onClick={() => setEditPost(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 flex items-center">
              <img
                src={getImageUrl(editPost.userId?.profilePic)}
                alt={editPost.userId?.fullname || "User"}
                className="w-10 h-10 rounded-full object-cover mr-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultAvatar;
                }}
              />
              <div>
                <p className="font-medium">
                  {editPost.userId?.fullname || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(editPost.createdAt)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                className="w-full border rounded-md p-2 h-40"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image
              </label>

              {imagePreview && (
                <div className="relative mb-2">
                  <img
                    src={imagePreview}
                    alt="Post image preview"
                    className="w-full h-40 object-cover rounded-md"
                  />
                  {selectedImage && (
                    <button
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                      aria-label="Remove selected image"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center space-x-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100"
                >
                  <Upload size={16} />
                  <span>
                    {selectedImage ? "Change Image" : "Upload New Image"}
                  </span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                onClick={() => setEditPost(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpdatePost}
                disabled={isUpdating || !editContent.trim()}
              >
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
