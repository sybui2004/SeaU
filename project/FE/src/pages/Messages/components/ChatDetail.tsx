import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import fileIcon from "@assets/images/icon-file.png";
import downloadIcon from "@assets/images/icon-download.png";
import { UserPlus, UserX, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateConversation } from "@/api/ConversationRequest";
import { uploadImage } from "@/actions/UploadAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFriendsList } from "@/api/UserRequest";

const SERVER_PUBLIC = "http://localhost:3000/images/";

interface Member {
  name: string;
  isAdmin: boolean;
  proPic?: string;
  _id?: string;
}

interface FileData {
  name: string;
  size: string;
  url?: string;
  type?: string;
}

interface ChatDetailProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
  members: Member[];
  isMobile?: boolean;
  currentUser: string;
  groupAdmin?: string;
  files: FileData[];
  selectedTab: "image" | "file";
  setSelectedTab: React.Dispatch<React.SetStateAction<"image" | "file">>;
  updateGroupInfo?: (data: {
    groupName?: string;
    groupAvatar?: File;
  }) => Promise<void>;
  removeMember?: (memberId: string) => Promise<void>;
  addMembers?: (memberIds: string[]) => Promise<void>;
}

const ChatDetail: React.FC<ChatDetailProps> = ({
  isOpen,
  chat,
  members,
  isMobile,
  currentUser,
  groupAdmin,
  files,
  selectedTab,
  setSelectedTab,
  updateGroupInfo,
  removeMember,
  addMembers,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(chat?.groupName || "");
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [newgroupAvatar, setNewgroupAvatar] = useState<File | null>(null);
  const [groupAvatarPreview, setgroupAvatarPreview] = useState<string | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Update newGroupName when chat changes
  useEffect(() => {
    setNewGroupName(chat?.groupName || "");
  }, [chat?.groupName]);

  const isGroup = chat?.isGroupChat;
  // Force string comparison for admin check
  const isAdmin = String(currentUser).trim() === String(groupAdmin).trim();
  const memberCount = isGroup ? members.length : 2;

  console.log("Current user:", currentUser, typeof currentUser);
  console.log("Group admin:", groupAdmin, typeof groupAdmin);
  console.log("Is admin:", isAdmin);

  // Update file filters based on current files
  useEffect(() => {
    if (files && files.length > 0) {
      console.log("Files in ChatDetail:", files);
    }
  }, [files]);

  // Separate files by type - use stable references for these filtered arrays
  const { imageFiles, videoFiles, audioFiles, documentFiles } =
    React.useMemo(() => {
      if (!files || files.length === 0) {
        return {
          imageFiles: [],
          videoFiles: [],
          audioFiles: [],
          documentFiles: [],
        };
      }

      console.log("Recalculating file categories with", files.length, "files");

      // Filter with proper type checking
      const imageFiles = files.filter(
        (file) =>
          (file.type && file.type.includes("image")) ||
          (file.name && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
      );

      const videoFiles = files.filter(
        (file) =>
          (file.type && file.type.includes("video")) ||
          (file.name && /\.(mp4|webm|mov|avi)$/i.test(file.name))
      );

      const audioFiles = files.filter(
        (file) =>
          (file.type && file.type.includes("audio")) ||
          (file.name && /\.(mp3|wav|ogg)$/i.test(file.name))
      );

      const documentFiles = files.filter(
        (file) =>
          !file.type ||
          (!file.type.includes("image") &&
            !file.type.includes("video") &&
            !file.type.includes("audio")) ||
          (file.name &&
            /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(file.name))
      );

      return { imageFiles, videoFiles, audioFiles, documentFiles };
    }, [files]);

  // Stable gallery tab handler
  const handleTabChange = useCallback((tab: "image" | "file") => {
    setSelectedTab(tab);
  }, []);

  // Stable file opener function for viewing
  const openFile = useCallback((fileUrl: string) => {
    window.open(fileUrl, "_blank");
  }, []);

  // New function to force download a file
  const downloadFile = useCallback((fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Gallery section with memo to prevent re-rendering
  const gallerySection = React.useMemo(() => {
    return (
      <>
        <h4 className="font-medium mt-6">Gallery</h4>

        <div className="flex mt-2">
          <Button
            variant="ghost"
            className={`rounded-full text-sm ${
              selectedTab === "image"
                ? "bg-[#1CA7EC] text-white px-6"
                : "bg-gray-100 text-gray-500 px-6"
            }`}
            onClick={() => handleTabChange("image")}
          >
            Images
          </Button>
          <Button
            variant="ghost"
            className={`rounded-full text-sm ml-2 ${
              selectedTab === "file"
                ? "bg-[#1CA7EC] text-white px-6"
                : "bg-gray-100 text-gray-500 px-6"
            }`}
            onClick={() => handleTabChange("file")}
          >
            Files
          </Button>
        </div>

        <div className="overflow-y-auto mt-4 custom-scrollbar">
          {selectedTab === "image" ? (
            <>
              {imageFiles.length === 0 && videoFiles.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No images or videos
                </div>
              ) : (
                <>
                  {imageFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {imageFiles.map((file, index) => (
                        <div
                          key={`img-${index}-${file.name}`}
                          className="relative aspect-square bg-gray-100 rounded-md"
                          onClick={() =>
                            openFile(file.url || `${SERVER_PUBLIC}${file.name}`)
                          }
                        >
                          {/* Image placeholder - always visible */}
                          <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                            <div className="text-gray-400 text-xs">Image</div>
                          </div>

                          {/* Actual image */}
                          <div className="w-full h-full relative">
                            <img
                              src={file.url || `${SERVER_PUBLIC}${file.name}`}
                              alt={file.name}
                              className="w-full h-full object-cover rounded-md absolute inset-0"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.style.opacity = "0"; // Hide the image on error
                              }}
                            />
                          </div>

                          {/* Download button */}
                          <button
                            className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md z-10"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening the file when clicking download
                              downloadFile(
                                file.url || `${SERVER_PUBLIC}${file.name}`,
                                file.name
                              );
                            }}
                          >
                            <img
                              src={downloadIcon}
                              alt="Download"
                              className="w-3 h-3"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {videoFiles.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Videos</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {videoFiles.map((file, index) => (
                          <div
                            key={`vid-${index}-${file.name}`}
                            className="relative bg-black rounded-md overflow-hidden"
                          >
                            <div className="aspect-video flex items-center justify-center">
                              {/* Static video thumbnail instead of video element */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                                <div className="text-white text-sm text-center mb-1">
                                  Video
                                </div>
                                <div className="text-xs text-gray-300 max-w-[90%] truncate">
                                  {file.name}
                                </div>
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 bg-opacity-80 mt-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                  >
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                  </svg>
                                </div>
                              </div>
                              <button
                                className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(
                                    file.url || `${SERVER_PUBLIC}${file.name}`,
                                    file.name
                                  );
                                }}
                              >
                                <img
                                  src={downloadIcon}
                                  alt="Download"
                                  className="w-3 h-3"
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {audioFiles.length === 0 && documentFiles.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No files attached
                </div>
              ) : (
                <>
                  {audioFiles.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">
                        Voice & Audio
                      </h5>
                      {audioFiles.map((file, index) => (
                        <div
                          key={`audio-${index}-${file.name}`}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg mb-2"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={fileIcon}
                              alt="File"
                              className="w-8 h-auto"
                            />
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="text-blue-500"
                            onClick={() =>
                              downloadFile(
                                file.url || `${SERVER_PUBLIC}${file.name}`,
                                file.name
                              )
                            }
                          >
                            <img
                              src={downloadIcon}
                              alt="Download"
                              className="w-4 h-4"
                            />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {documentFiles.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Documents</h5>
                      {documentFiles.map((file, index) => (
                        <div
                          key={`doc-${index}-${file.name}`}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg mb-2"
                        >
              <div className="flex items-center gap-2">
                            <img
                              src={fileIcon}
                              alt="File"
                              className="w-8 h-auto"
                            />
                <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="text-blue-500"
                            onClick={() =>
                              downloadFile(
                                file.url || `${SERVER_PUBLIC}${file.name}`,
                                file.name
                              )
                            }
                          >
                            <img
                              src={downloadIcon}
                              alt="Download"
                              className="w-4 h-4"
                            />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </>
    );
  }, [
    selectedTab,
    imageFiles,
    videoFiles,
    audioFiles,
    documentFiles,
    handleTabChange,
    openFile,
    downloadFile,
  ]);

  const handleMemberClick = (memberId?: string) => {
    if (memberId) {
      navigate(`/profile/${memberId}`);
    }
  };

  // Fetch friends list when showing add members dialog
  useEffect(() => {
    if (showAddMembers) {
      const fetchFriends = async () => {
        try {
          // Get the current user's friends
          const response = await getFriendsList(currentUser, 1, 100);
          console.log("Friends list response:", response);

          // Check the structure of the response
          let friendsData = [];
          if (response.data && Array.isArray(response.data)) {
            friendsData = response.data;
          } else if (
            response.data &&
            response.data.friends &&
            Array.isArray(response.data.friends)
          ) {
            friendsData = response.data.friends;
          } else {
            console.error("Unexpected friends data structure:", response.data);
            friendsData = [];
          }

          // Filter out users who are already members
          const existingMemberIds = members.map((member) => member._id);
          const availableFriends = friendsData.filter(
            (friend: any) => !existingMemberIds.includes(friend._id)
          );

          console.log("Available friends to add:", availableFriends);
          setFriendsList(availableFriends);
        } catch (error) {
          console.error("Error fetching friends:", error);
          toast.error("Failed to load friends list");
        }
      };

      fetchFriends();
    }
  }, [showAddMembers, members, currentUser]);

  const handleRemoveMember = async (memberId?: string) => {
    if (!memberId || !removeMember) return;

    try {
      console.log("Removing member with ID:", memberId);

      // If there are only 3 members (or fewer) in the group, we can't remove more
      if (members.length <= 3) {
        toast.warning("Group must have at least 3 members");
        return;
      }

      setIsUpdating(true);
      await removeMember(memberId);
      toast.success("Member removed from group");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGroupNameSave = async () => {
    if (!chat?._id || isUpdating) return;

    try {
      setIsUpdating(true);

      // Use the direct API function instead of the provided updateGroupInfo prop
      const response = await updateConversation(
        chat._id,
        newGroupName,
        chat.groupAvatar || "",
        currentUser
      );

      console.log("Update response:", response);

      // If we have the updateGroupInfo prop, also call that to ensure UI updates
      if (updateGroupInfo) {
        await updateGroupInfo({ groupName: newGroupName });
      }

      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating group name:", error);
      toast.error("Failed to update group name");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlegroupAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setgroupAvatarPreview(imageUrl);
      setNewgroupAvatar(file);
      console.log("Selected new group image:", file.name);
    }
  };

  const handlegroupAvatarSave = async () => {
    if (!newgroupAvatar || !chat?._id || isUpdating) return;

    try {
      setIsUpdating(true);

      // First upload the image
      const data = new FormData();
      const fileName = Date.now() + newgroupAvatar.name;
      data.append("name", fileName);
      data.append("file", newgroupAvatar);

      // Upload image through the upload API
      dispatch(uploadImage(data) as any);

      // Update conversation with the new image filename
      const response = await updateConversation(
        chat._id,
        chat.groupName || "",
        fileName,
        currentUser
      );

      console.log("Update photo response:", response);

      // Also call the provided updateGroupInfo if available
      if (updateGroupInfo) {
        await updateGroupInfo({ groupAvatar: newgroupAvatar });
      }

      // Update local chat object to reflect changes immediately
      if (chat) {
        chat.groupAvatar = fileName;
      }

      toast.success("Group avatar updated");

      // Keep the preview but clear the newgroupAvatar state
      // This allows the UI to show the new image while preventing multiple uploads
      setNewgroupAvatar(null);
    } catch (error) {
      console.error("Error updating group photo:", error);
      toast.error("Failed to update group photo");
      // Clear preview on error
      setNewgroupAvatar(null);
      setgroupAvatarPreview(null);
    } finally {
      setIsUpdating(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (groupAvatarPreview) {
        URL.revokeObjectURL(groupAvatarPreview);
      }
    };
  }, [groupAvatarPreview]);

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0 || !addMembers) return;

    try {
      console.log("Adding members:", selectedFriends);
      setIsUpdating(true);

      await addMembers(selectedFriends);

      // Clear selection and close dialog
      setSelectedFriends([]);
      setShowAddMembers(false);
    } catch (error) {
      console.error("Error adding members:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "translate-x-full"
      } fixed right-0 top-0 z-30 h-full w-72 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900 ${
        isMobile ? "w-full" : "border-l dark:border-gray-800"
      }`}
    >
      <div className="p-4">
        <div className="mb-6 flex flex-col items-center">
          {isGroup ? (
            <div className="relative mb-2">
              <div className="flex justify-center">
                <div className="relative inline-block">
                  {groupAvatarPreview || chat?.groupAvatar ? (
                    <img
                      src={
                        groupAvatarPreview
                          ? groupAvatarPreview
                          : chat?.groupAvatar
                          ? chat.groupAvatar.startsWith("http")
                            ? chat.groupAvatar
                            : `${SERVER_PUBLIC}${chat.groupAvatar}`
                          : ""
                      }
                      alt={chat?.groupName || "Group"}
                      className="h-16 w-16 rounded-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load group image:", e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentNode;
                        if (parent) {
                          const fallback = document.createElement("div");
                          fallback.className =
                            "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-2xl font-bold text-white";
                          fallback.textContent = "G";
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-2xl font-bold text-white">
                      G
                    </div>
                  )}

                  {isAdmin && (
                    <div
                      className="absolute bottom-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-2 cursor-pointer transition-colors hover:opacity-80"
                      onClick={handleCameraClick}
                    >
                      <span className="text-white text-sm">📷</span>
                    </div>
                  )}
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlegroupAvatarChange}
                className="hidden"
                accept="image/*"
                title="Group Picture Upload"
                aria-label="Upload group picture"
              />

              {/* Save/Cancel buttons for new photo */}
              {newgroupAvatar && (
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    className="rounded-full bg-[#1CA7EC] px-6 py-1 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlegroupAvatarSave}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="rounded-full border border-gray-300 px-6 py-1 text-sm"
                    onClick={() => {
                      if (groupAvatarPreview) {
                        URL.revokeObjectURL(groupAvatarPreview);
                      }
                      setNewgroupAvatar(null);
                      setgroupAvatarPreview(null);
                    }}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : members.length > 0 && members[0]?.proPic ? (
            <div
              onClick={() => handleMemberClick(members[0]?._id)}
              className={members[0]?._id ? "cursor-pointer" : ""}
            >
              <img
                src={
                  members[0].proPic.startsWith("http")
                    ? members[0].proPic
                    : `${SERVER_PUBLIC}${members[0].proPic}`
                }
                alt={members[0].name}
                className="mb-2 h-16 w-16 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentNode;
                  const div = document.createElement("div");
                  div.className =
                    "mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300";
                  div.textContent = members[0].name.charAt(0).toUpperCase();
                  if (parent) parent.appendChild(div);
                }}
              />
            </div>
          ) : (
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {members.length > 0
                ? members[0].name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}

          {/* Group name with edit functionality */}
          {isGroup && isEditingName && isAdmin ? (
            <div className="w-full flex flex-col items-center mb-2">
              <div className="flex overflow-hidden items-center w-full h-10 px-3 rounded-lg border border-solid border-[#1CA7EC] shadow-sm bg-white">
                <input
                  className="flex-grow bg-transparent outline-none text-center text-sm"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                  aria-label="Group name"
                  placeholder="Enter group name"
                />
              </div>

              <div className="flex justify-center gap-2 mt-2">
                <button
                  className="rounded-full bg-[#1CA7EC] px-6 py-1 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleGroupNameSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  className="rounded-full border border-gray-300 px-6 py-1 text-sm"
                  onClick={() => setIsEditingName(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            isGroup && (
              <div className="w-full px-3 mb-2">
                {isAdmin ? (
                  <div
                    className="flex items-center justify-between h-10 px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                    onClick={() => setIsEditingName(true)}
                  >
                    <span className="text-gray-500 flex-grow text-center">
                      {chat?.groupName || "Enter group name"}
                    </span>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </div>
                ) : (
                  <div className="text-center mb-1">
                    <span className="text-gray-700 font-medium">
                      {chat?.groupName || "Group Chat"}
                    </span>
                  </div>
                )}
              </div>
            )
          )}

          {isGroup && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {memberCount} people joined
            </p>
          )}
        </div>

        {isGroup && (
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
              Group members
            </h4>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    member._id ? "cursor-pointer" : ""
                  }`}
                  onClick={() => member._id && handleMemberClick(member._id)}
                >
                  <div className="flex items-center">
                    {member.proPic ? (
                      <>
                        <img
                          src={
                            member.proPic.startsWith("http")
                              ? member.proPic
                              : `${SERVER_PUBLIC}${member.proPic}`
                          }
                          alt={member.name}
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            const parent = (e.target as HTMLImageElement)
                              .parentNode;
                            const fallbackDiv = document.createElement("div");
                            fallbackDiv.className =
                              "mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300";
                            fallbackDiv.textContent = member.name
                              .charAt(0)
                              .toUpperCase();
                            if (parent) parent.appendChild(fallbackDiv);
                          }}
                        />
                      </>
                    ) : (
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium text-gray-900 dark:text-white ${
                          member._id ? "hover:underline" : ""
                        }`}
                      >
                        {member.name}
                      </p>
                      {member.isAdmin && (
                        <span className="text-xs text-blue-500 dark:text-blue-400">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  {isAdmin && member._id !== currentUser && (
                    <button
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      aria-label={`Remove ${member.name} from group`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMember(member._id);
                      }}
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isGroup && isAdmin && (
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800 mb-4">
            <button
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => setShowAddMembers(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add members
            </button>
          </div>
        )}

        {showAddMembers && (
          <div className="mb-4 p-3 border rounded-lg bg-white">
            <h4 className="font-medium text-gray-900 mb-2">Add Friends</h4>
            <div className="max-h-40 overflow-y-auto mb-3">
              {friendsList.length > 0 ? (
                friendsList.map((friend: any) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {friend.profilePicture ? (
                        <img
                          src={
                            friend.profilePicture.startsWith("http")
                              ? friend.profilePicture
                              : `${SERVER_PUBLIC}${friend.profilePicture}`
                          }
                          alt={friend.fullname || friend.username}
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentNode;
                            if (parent) {
                              const div = document.createElement("div");
                              div.className =
                                "mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium";
                              div.textContent = (
                                friend.fullname || friend.username
                              )
                                .charAt(0)
                                .toUpperCase();
                              parent.appendChild(div);
                            }
                          }}
                        />
                      ) : (
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium">
                          {(friend.fullname || friend.username)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <span>{friend.fullname || friend.username}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFriends((prev) => [...prev, friend._id]);
                        } else {
                          setSelectedFriends((prev) =>
                            prev.filter((id) => id !== friend._id)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-500"
                      aria-label={`Select ${
                        friend.fullname || friend.username
                      }`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  No friends available to add
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddMembers(false);
                  setSelectedFriends([]);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={selectedFriends.length === 0 || isUpdating}
                onClick={handleAddMembers}
              >
                {isUpdating ? "Adding..." : "Add Selected"}
              </Button>
            </div>
        </div>
        )}

        {/* Gallery section - use memoized component */}
        {gallerySection}
      </div>
    </div>
  );
};

export default ChatDetail;
