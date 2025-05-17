import { FC, useState, useEffect, useRef } from "react";
import {
  getUserPosts,
  updatePost,
  updatePostWithImage,
  deletePost,
} from "@/api/PostRequest";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, X, Upload } from "lucide-react";

interface UserPostsProps {
  userId: string;
}

interface Post {
  _id: string;
  userId: string;
  content: string;
  image?: string;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

const UserPosts: FC<UserPostsProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serverPublic =
    import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMM yyyy, HH:mm", { locale: vi });
    } catch (error) {
      return dateStr;
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;

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

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const response = await getUserPosts(userId);
        if (response.data && response.data.posts) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setSelectedImage(null);
    setImagePreview(post.image ? (getImageUrl(post.image) as string) : null);
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
    if (editingPost?.image) {
      setImagePreview(getImageUrl(editingPost.image) as string);
    } else {
      setImagePreview(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    if (!editingPost) return;

    try {
      setIsUpdating(true);

      if (selectedImage) {
        console.log("Updating post with new image:", selectedImage.name);

        const formData = new FormData();
        formData.append("userId", editingPost.userId);
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

        const response = await updatePostWithImage(editingPost._id, formData);
        console.log("Update response:", response.data);

        if (response.data) {
          setPosts(
            posts.map((post) =>
              post._id === editingPost._id
                ? {
                    ...post,
                    content: editContent,
                    image: response.data.image || post.image,
                  }
                : post
            )
          );
          setEditingPost(null);
          setSelectedImage(null);
          setImagePreview(null);
        }
      } else {
        const response = await updatePost(editingPost._id, {
          userId: editingPost.userId,
          content: editContent,
          isAdmin: true,
        });

        if (response.data) {
          setPosts(
            posts.map((post) =>
              post._id === editingPost._id
                ? { ...post, content: editContent }
                : post
            )
          );
          setEditingPost(null);
        }
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      setDeletingPostId(postId);
      setIsDeleting(true);

      const post = posts.find((p) => p._id === postId);
      if (!post) {
        throw new Error("Post not found");
      }

      console.log("Deleting post:", post);
      console.log("Deleting with postId:", postId);
      console.log("Deleting with userId:", post.userId);
      console.log("Deleting with isAdmin:", true);

      const response = await deletePost(postId, post.userId, true);
      console.log("Delete response:", response);

      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error: any) {
      console.error("Error deleting post:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingPostId(null);
    }
  };

  const confirmDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      handleDelete(postId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User Posts</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <h4 className="text-lg font-medium truncate">
                    {post.content?.substring(0, 50)}
                    {post.content?.length > 50 ? "..." : ""}
                  </h4>
                </div>
                <p className="text-gray-600 mt-2 mb-3 line-clamp-2">
                  {post.content}
                </p>
                {post.image && (
                  <div className="mb-3">
                    <img
                      src={getImageUrl(post.image) as string}
                      alt="Post image"
                      className="rounded-md max-h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>❤️ {post.likes?.length || 0} likes</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline hover:bg-red-50 px-2 py-1 rounded"
                      onClick={() => confirmDelete(post._id)}
                      disabled={isDeleting && deletingPostId === post._id}
                    >
                      {isDeleting && deletingPostId === post._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              User has no posts.
            </div>
          )}
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Post</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
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
                onClick={() => setEditingPost(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpdate}
                disabled={isUpdating || !editContent.trim()}
              >
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
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

export default UserPosts;
