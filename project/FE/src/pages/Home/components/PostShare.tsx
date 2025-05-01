import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  UilScenery,
  UilPlayCircle,
  UilLocationPoint,
  UilSchedule,
  UilTimes,
} from "@iconscout/react-unicons";
import { uploadImage } from "@/actions/UploadAction";
import { createPost } from "@/actions/PostAction";
import { PostData } from "@/api/UploadRequest";

const PostShare = () => {
  const loading = useSelector((state: any) => state.postReducer.uploading);
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const content = useRef<HTMLInputElement>(null);
  const { user } = useSelector((state: any) => state.authReducer.authData);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setImage(img);
    }
  };

  const reset = () => {
    setImage(null);
    if (content.current) {
      content.current.value = "";
    }
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!content.current?.value && !image) return;

    const newPost: PostData = {
      userId: user._id,
      content: content.current?.value,
    };

    if (image) {
      const formData = new FormData();
      const filename = Date.now() + image.name;
      formData.append("name", filename);
      formData.append("file", image);
      newPost.image = filename;

      try {
        dispatch(uploadImage(formData) as any);
        dispatch(createPost(newPost) as any);
        reset();
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(createPost(newPost) as any);
      reset();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full mx-auto">
      <div className="flex gap-4 w-full">
        <img
          src={
            user.profilePic
              ? serverPublic + user.profilePic
              : serverPublic + "defaultProfile.png"
          }
          className="object-cover shrink-0 self-stretch my-auto w-14 rounded-full aspect-square border-2 border-white shadow-md"
          alt="Post author avatar"
        />
        <input
          ref={content}
          required
          type="text"
          placeholder="What's on your mind?"
          className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="flex justify-between w-full border-t pt-3">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
          onClick={() => imageRef.current?.click()}
        >
          <UilScenery className="text-blue-500" />
          <span className="text-gray-600">Photo</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
          <UilPlayCircle className="text-green-500" />
          <span className="text-gray-600">Video</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
          <UilLocationPoint className="text-red-500" />
          <span className="text-gray-600">Location</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
          <UilSchedule className="text-purple-500" />
          <span className="text-gray-600">Schedule</span>
        </div>
        <Button
          variant="gradientCustom"
          className={`flex items-center gap-2 px-3 py-3 mt-1.5 h-full text-base leading-loose text-white shadow-[0_4px_10px_rgba(28,167,236,0.5)] transition-all duration-300 ${
            isHovered ? "shadow-lg scale-105" : ""
          } cursor-pointer`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleShare}
          disabled={loading}
        >
          {loading ? "Sharing..." : "Share"}
        </Button>
        <div className="hidden">
          <label htmlFor="myImage" className="sr-only">
            Upload Image
          </label>
          <input
            type="file"
            name="myImage"
            id="myImage"
            ref={imageRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            aria-label="Upload Image"
          />
        </div>
      </div>

      {image && (
        <div className="relative w-full mt-3">
          <UilTimes
            className="absolute top-2 right-2 cursor-pointer bg-white rounded-full text-red-500 p-1 hover:bg-gray-100"
            onClick={() => setImage(null)}
          />
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default PostShare;
