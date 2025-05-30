import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatDetail from "./ChatDetail";
import ChatMessagesView from "./ChatMessagesView";

import {
  Message,
  Member,
  FileData,
  ChatMainProps,
  formatFileSize,
} from "./message-utils/MessageTypes";
import {
  loadMessages,
  processReceivedMessage,
} from "./message-utils/MessageLoader";
import {
  createTempMessage,
  createMessageData,
} from "./message-utils/MessageFormatter";
import {
  uploadFileToServer,
  getFileType,
  releaseTempFileUrl,
} from "./message-utils/FileHandler";
import {
  isNearBottom,
  isNearTop,
  scrollToBottom,
  saveScrollPosition,
  restoreScrollPosition,
} from "./message-utils/ScrollManager";

import { getUser } from "@/api/UserRequest";
import {
  getConversation,
  addToGroup,
  removeFromGroup,
  updateConversation,
} from "@/api/ConversationRequest";
import { addMessage } from "@/api/MessageRequest";
const ChatMain: React.FC<ChatMainProps> = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
}) => {
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [conversationDetail, setConversationDetail] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [isChatDetailVisible, setIsChatDetailVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"image" | "file">("image");
  const [isHovered, setIsHovered] = useState({
    addMember: false,
    chatMessage: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<
    "image" | "audio" | "video" | "other" | null
  >(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: any) => state.authReducer.authData);
  const currentUserProfilePic = user?.profilePic || undefined;

  useEffect(() => {
    setInitialScrollDone(false);
    setMessagesLoaded(false);
    setPage(1);
    setHasMoreMessages(true);
  }, [chat?._id]);

  useEffect(() => {
    if (!chat?._id) return;

    const fetchConversationDetail = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching conversation details:", chat._id);
        const { data } = await getConversation(chat._id);
        console.log("Conversation details:", data);

        const conversationData = data.conversation || data;
        setConversationDetail(conversationData);

        if (conversationData.isGroupChat) {
          console.log("This is a group chat, updating group info");

          const groupMembers: Member[] = [];

          groupMembers.push({
            name: "You",
            isAdmin: currentUser === conversationData.groupAdmin,
            proPic: currentUserProfilePic,
          });

          if (Array.isArray(conversationData.members)) {
            const memberPromises = conversationData.members
              .filter((member: any) => {
                if (typeof member === "object" && member._id) {
                  return member._id !== currentUser;
                }
                return member !== currentUser;
              })
              .map(async (member: any) => {
                const memberId =
                  typeof member === "object" ? member._id : member;
                if (!memberId) return null;

                try {
                  const { data } = await getUser(memberId);
                  return {
                    name: data.fullname || data.username || "Group member",
                    isAdmin: memberId === conversationData.groupAdmin,
                    proPic: data.profilePic || undefined,
                    _id: memberId,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching member ${memberId} info:`,
                    error
                  );
                  return {
                    name: "Group member",
                    isAdmin: memberId === conversationData.groupAdmin,
                    proPic: undefined,
                    _id: memberId,
                  };
                }
              });

            const memberDetails = await Promise.all(memberPromises);
            const validMembers = memberDetails.filter((m) => m !== null);
            setMembers([...groupMembers, ...validMembers]);
          }
        } else {
          await getUserData();
        }
      } catch (error) {
        console.error("Error fetching conversation info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationDetail();
  }, [chat?._id, currentUser, currentUserProfilePic]);

  const getUserData = async () => {
    if (!chat || !currentUser) {
      console.log("No chat or currentUser:", { chat, currentUser });
      return;
    }

    if (
      !chat._id ||
      !chat.members ||
      (Array.isArray(chat.members) && chat.members.length < 2)
    ) {
      console.error("Invalid conversation:", chat);
      return;
    }

    console.log("Loading chat data:", chat);
    setIsLoading(true);

    let userId: string | undefined;
    let otherUsers = [];

    if (Array.isArray(chat.members)) {
      console.log("Chat members:", JSON.stringify(chat.members));

      otherUsers = chat.members.filter((member: any) => {
        if (typeof member === "object" && member !== null) {
          return member._id !== currentUser;
        }
        return member !== currentUser;
      });

      console.log("Filtered other users:", JSON.stringify(otherUsers));

      if (otherUsers.length > 0) {
        const firstUser = otherUsers[0];
        if (typeof firstUser === "object" && firstUser !== null) {
          userId = firstUser._id;
        } else if (typeof firstUser === "string") {
          userId = firstUser;
        }
        console.log("Extracted userId:", userId);
      } else {
        console.warn("No other users found in the conversation");
      }
    } else if (chat.members && typeof chat.members === "object") {
      console.log("Members is not an array but an object:", chat.members);

      const memberIds = Object.values(chat.members).filter(
        (member: any) => typeof member === "string" && member !== currentUser
      );

      if (memberIds.length > 0) {
        userId = memberIds[0] as string;
        console.log("Extracted userId from object:", userId);
      }
    } else {
      console.error("Invalid members structure:", chat.members);
    }

    console.log("Found userId:", userId);

    try {
      if (!userId) {
        console.error("Invalid userId, cannot fetch user data");

        const fallbackMembers: Member[] = [
          {
            name: "You",
            isAdmin: true,
            proPic: currentUserProfilePic,
          },
        ];

        setMembers(fallbackMembers);
        return;
      }

      const { data } = await getUser(userId);
      console.log("User data received:", data);
      setUserData(data);

      const membersList: Member[] = [];

      if (data) {
        membersList.push({
          name: data.fullname || data.username || "User",
          isAdmin: false,
          proPic: data.profilePic || undefined,
        });
      } else {
        membersList.push({
          name: "User",
          isAdmin: false,
          proPic: undefined,
        });
      }

      membersList.push({
        name: "You",
        isAdmin: true,
        proPic: currentUserProfilePic,
      });

      console.log("Updated members list:", membersList);
      setMembers(membersList);
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!chat?._id) {
      console.log("No chat._id to load messages");
      return;
    }

    console.log("Loading messages for chat ID:", chat._id);
    setIsLoading(true);
    setFiles([]);

    const fetchMessages = async () => {
      try {
        const result = await loadMessages(
          chat._id,
          currentUser,
          currentUserProfilePic
        );
        console.log("Loaded messages:", result.messages.length);
        console.log("Files loaded:", result.fileData);

        setMessages(result.messages);

        if (result.fileData && result.fileData.length > 0) {
          const uniqueFiles = new Map();

          result.fileData.forEach((file) => {
            const key = file.url || file.name;
            if (key && !uniqueFiles.has(key)) {
              uniqueFiles.set(key, {
                ...file,
                type: file.type || "other",
                size: file.size || "Unknown",
              });
            }
          });

          setFiles(Array.from(uniqueFiles.values()));
        }

        setMessagesLoaded(true);
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessagesLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chat?._id, currentUser, currentUserProfilePic]);

  useEffect(() => {
    if (!receivedMessage || receivedMessage.chatId !== chat?._id) return;

    console.log("Received new message:", receivedMessage);

    const processMessage = async () => {
      try {
        const newMsg = await processReceivedMessage(
          receivedMessage,
          currentUser,
          currentUserProfilePic,
          userData
        );

        setMessages((prev) => [...prev, newMsg]);

        if (newMsg.fileData || newMsg.fileUrl) {
          const fileType =
            newMsg.fileType ||
            (newMsg.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              ? "image"
              : newMsg.fileName?.match(/\.(mp4|webm|mov|avi)$/i)
              ? "video"
              : newMsg.fileName?.match(/\.(mp3|wav|ogg)$/i)
              ? "audio"
              : "other");

          const newFile: FileData = {
            name: newMsg.fileName || "File",
            size: newMsg.fileSize || "0KB",
            url: newMsg.fileUrl,
            type: fileType,
          };

          setFiles((prev) => {
            const fileExists = prev.some(
              (file) =>
                (file.url && file.url === newFile.url) ||
                (file.name && file.name === newFile.name)
            );

            if (fileExists) return prev;
            return [...prev, newFile];
          });
        }
      } catch (error) {
        console.error("Error processing received message:", error);
      }
    };

    processMessage();
  }, [
    receivedMessage,
    chat?._id,
    currentUser,
    currentUserProfilePic,
    userData,
  ]);

  useEffect(() => {
    if (
      messagesLoaded &&
      !isLoading &&
      messages.length > 0 &&
      !initialScrollDone
    ) {
      if (!restoreScrollPosition(chatContainerRef.current, chat?._id || "")) {
        scrollToBottom(chatContainerRef.current);
      }
      setInitialScrollDone(true);
    }
  }, [
    messagesLoaded,
    isLoading,
    messages.length,
    initialScrollDone,
    chat?._id,
  ]);

  useEffect(() => {
    if (messages.length > 0 && initialScrollDone && chatContainerRef.current) {
      if (isNearBottom(chatContainerRef.current)) {
        scrollToBottom(chatContainerRef.current);
      }
    }
  }, [messages.length, initialScrollDone]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    saveScrollPosition(chatContainerRef.current, chat?._id || "");
    setScrollPosition(chatContainerRef.current.scrollTop);

    if (
      isNearTop(chatContainerRef.current) &&
      hasMoreMessages &&
      !isLoadingMore
    ) {
      loadMoreMessages();
    }
  };

  const loadMoreMessages = async () => {
    if (!chat?._id || isLoadingMore || !chatContainerRef.current) return;

    try {
      setIsLoadingMore(true);
      const container = chatContainerRef.current;
      const currentScrollPosition = container.scrollTop || 0;
      const currentScrollHeight = container.scrollHeight;

      setPrevScrollHeight(currentScrollHeight);

      const result = await loadMessages(
        chat._id,
        currentUser,
        currentUserProfilePic,
        page + 1
      );

      if (result.messages.length === 0) {
        console.log("No more old messages");
        setHasMoreMessages(false);
        setIsLoadingMore(false);
        return;
      }

      setMessages((prevMessages) => [...result.messages, ...prevMessages]);
      console.log("Added", result.messages.length, "old messages to the list");
      setPage((prev) => prev + 1);

      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeight;

          container.scrollTop = currentScrollPosition + heightDifference;
        }
      }, 50);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile && !fileUrl) || !chat?._id) {
      console.log("Cannot send empty message or no chat ID");
      return;
    }

    const newMsg = createTempMessage(
      message,
      currentUser,
      chat._id,
      currentUserProfilePic,
      { selectedFile, fileUrl, fileType }
    );

    setMessages((prevMessages) => [...prevMessages, newMsg]);

    try {
      let filePath: string | null = null;

      if (selectedFile) {
        try {
          console.log("Uploading file with type:", fileType);

          const localFileUrl = fileUrl || URL.createObjectURL(selectedFile);

          const tempFile: FileData = {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            url: localFileUrl,
            type: fileType || "other",
          };

          setFiles((prev) => {
            const fileExists = prev.some(
              (file) =>
                (file.url && file.url === tempFile.url) ||
                (file.name && file.name === tempFile.name)
            );

            if (fileExists) return prev;
            return [...prev, tempFile];
          });

          filePath = await uploadFileToServer(
            selectedFile,
            fileType || "other"
          );

          console.log("File uploaded successfully:", filePath);

          if (filePath) {
            setFiles((prev) => {
              return prev.map((file) => {
                if (file.name === selectedFile.name) {
                  const updatedFile: FileData = {
                    ...file,
                    url: filePath as string,
                  };
                  return updatedFile;
                }
                return file;
              });
            });
          }
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Cannot upload file. Please try again later.");
        }
      }

      const messageData = createMessageData(
        message,
        currentUser,
        chat._id,
        {
          selectedFile,
          fileUrl: filePath || null,
          fileType,
        },
        chat.members.find((id: string) => id !== currentUser)
      );

      if (filePath) {
        messageData.fileData = filePath;
        messageData.fileUrl = filePath;
        messageData.fileType = fileType || "other";
        messageData.fileName = selectedFile?.name;
        messageData.fileSize = selectedFile?.size;
      }

      console.log("Message data to send:", messageData);

      if (setSendMessage) {
        setSendMessage(messageData);
        console.log("Sent message via socket");
      }

      const msgResponse = await addMessage(messageData);
      console.log("Message saved to DB:", msgResponse.data);

      if (msgResponse.data && msgResponse.data._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === newMsg.id
              ? {
                  ...msg,
                  id: msgResponse.data._id,
                  fileData: msgResponse.data.fileData || filePath,
                  fileUrl: msgResponse.data.fileUrl || filePath,
                  fileType: msgResponse.data.fileType || fileType,
                }
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      console.error("Error details:", error.response || error.message);
      toast.error("Cannot send message. Please try again later.");
    } finally {
      setMessage("");
      setSelectedFile(null);
      setFileType(null);
      if (fileUrl) {
        releaseTempFileUrl(fileUrl);
        setFileUrl(null);
      }
    }
  };

  const handleFileSelected = (file: File) => {
    if (fileUrl) {
      releaseTempFileUrl(fileUrl);
    }

    setSelectedFile(file);

    const type = getFileType(file);
    setFileType(type);

    setFileUrl(URL.createObjectURL(file));
  };

  const handleVoiceRecorded = (audioBlob: Blob) => {
    if (fileUrl) {
      releaseTempFileUrl(fileUrl);
    }

    setSelectedFile(
      new File([audioBlob], "voice-message.mp3", { type: "audio/mp3" })
    );
    setFileType("audio");
    setFileUrl(URL.createObjectURL(audioBlob));
  };

  useEffect(() => {
    return () => {
      if (fileUrl) {
        releaseTempFileUrl(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleAddMembers = async (memberIds: string[]) => {
    if (!chat?._id || !conversationDetail?.groupAdmin) {
      console.error("Missing chat ID or group admin");
      return;
    }

    try {
      console.log("Adding members to group:", memberIds);

      const addPromises = memberIds.map(async (memberId) => {
        try {
          const response = await addToGroup(chat._id, memberId, currentUser);
          console.log(`Added member ${memberId} response:`, response);
          return { success: true, memberId, userData: response.data };
        } catch (error) {
          console.error(`Failed to add member ${memberId}:`, error);
          return { success: false, memberId, error };
        }
      });

      const results = await Promise.all(addPromises);
      const successCount = results.filter((r) => r.success).length;

      if (successCount > 0) {
        const { data } = await getConversation(chat._id);
        const conversationData = data.conversation || data;
        setConversationDetail(conversationData);

        if (conversationData.isGroupChat) {
          console.log("Refreshing group members after adding new members");

          const groupMembers: Member[] = [];

          groupMembers.push({
            name: "You",
            isAdmin: currentUser === conversationData.groupAdmin,
            proPic: currentUserProfilePic,
          });

          if (Array.isArray(conversationData.members)) {
            const memberPromises = conversationData.members
              .filter((member: any) => {
                if (typeof member === "object" && member._id) {
                  return member._id !== currentUser;
                }
                return member !== currentUser;
              })
              .map(async (member: any) => {
                const memberId =
                  typeof member === "object" ? member._id : member;
                if (!memberId) return null;

                try {
                  const { data } = await getUser(memberId);
                  return {
                    name: data.fullname || data.username || "Group member",
                    isAdmin: memberId === conversationData.groupAdmin,
                    proPic: data.profilePic || undefined,
                    _id: memberId,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching member ${memberId} info:`,
                    error
                  );
                  return {
                    name: "Group member",
                    isAdmin: memberId === conversationData.groupAdmin,
                    proPic: undefined,
                    _id: memberId,
                  };
                }
              });

            const memberDetails = await Promise.all(memberPromises);
            const validMembers = memberDetails.filter((m) => m !== null);
            setMembers([...groupMembers, ...validMembers]);
          }
        }

        toast.success(`Added ${successCount} members to the group`);
      } else {
        toast.error("Failed to add members to the group");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("Failed to add members to the group");
      throw error;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!chat?._id || !conversationDetail?.groupAdmin) {
      console.error("Missing chat ID or group admin");
      return;
    }

    try {
      console.log("Removing member from group:", memberId);

      if (
        Array.isArray(conversationDetail.members) &&
        conversationDetail.members.length <= 3
      ) {
        console.log("Cannot remove member: group must have at least 3 members");
        toast.error("Group must have at least 3 members");
        return;
      }

      const response = await removeFromGroup(chat._id, memberId, currentUser);

      console.log("Remove member response:", response);

      const { data } = await getConversation(chat._id);
      const conversationData = data.conversation || data;
      setConversationDetail(conversationData);

      if (conversationData.isGroupChat) {
        console.log("Refreshing group members after removing a member");

        const groupMembers: Member[] = [];

        groupMembers.push({
          name: "You",
          isAdmin: currentUser === conversationData.groupAdmin,
          proPic: currentUserProfilePic,
        });

        if (Array.isArray(conversationData.members)) {
          const memberPromises = conversationData.members
            .filter((member: any) => {
              if (typeof member === "object" && member._id) {
                return member._id !== currentUser;
              }
              return member !== currentUser;
            })
            .map(async (member: any) => {
              const memberId = typeof member === "object" ? member._id : member;
              if (!memberId) return null;

              try {
                const { data } = await getUser(memberId);
                return {
                  name: data.fullname || data.username || "Group member",
                  isAdmin: memberId === conversationData.groupAdmin,
                  proPic: data.profilePic || undefined,
                  _id: memberId,
                };
              } catch (error) {
                console.error(`Error fetching member ${memberId} info:`, error);
                return {
                  name: "Group member",
                  isAdmin: memberId === conversationData.groupAdmin,
                  proPic: undefined,
                  _id: memberId,
                };
              }
            });

          const memberDetails = await Promise.all(memberPromises);
          const validMembers = memberDetails.filter((m) => m !== null);
          setMembers([...groupMembers, ...validMembers]);
        }
      }

      toast.success("Member removed from group");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member from group");
      throw error;
    }
  };

  const handleUpdateGroupInfo = async (data: {
    groupName?: string;
    groupAvatar?: File;
  }) => {
    if (!chat?._id) {
      console.error("Missing chat ID");
      return;
    }

    try {
      console.log("Updating group info:", data);

      let fileName = "";

      if (data.groupAvatar) {
        const formData = new FormData();
        fileName = Date.now() + data.groupAvatar.name;
        formData.append("name", fileName);
        formData.append("file", data.groupAvatar);

        await uploadFileToServer(data.groupAvatar, "image");
      }

      const response = await updateConversation(
        chat._id,
        data.groupName || chat.groupName || "",
        fileName || chat.groupAvatar || "",
        currentUser
      );

      console.log("Update group info response:", response);

      const { data: refreshData } = await getConversation(chat._id);
      const conversationData = refreshData.conversation || refreshData;
      setConversationDetail(conversationData);

      toast.success("Group information updated");
    } catch (error) {
      console.error("Error updating group info:", error);
      toast.error("Failed to update group information");
      throw error;
    }
  };

  return (
    <div className="flex h-full w-full">
      <div
        className={`${
          isChatDetailVisible ? "w-[70%]" : "w-full"
        } h-full flex flex-col`}
      >
        <ChatHeader
          chatName={
            chat?.isGroupChat
              ? chat?.chatName || chat?.groupName || "Group chat"
              : userData?.fullname || userData?.username || "Conversation"
          }
          isGroup={chat?.isGroupChat}
          avatar={
            chat?.isGroupChat
              ? chat?.groupPhoto || undefined
              : userData?.profilePic || undefined
          }
          members={members}
          toggleChatDetail={() => setIsChatDetailVisible((prev) => !prev)}
        />

        <ChatMessagesView
          messages={messages}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          onScroll={handleScroll}
          chatEndRef={chatEndRef as React.RefObject<HTMLDivElement>}
          containerRef={chatContainerRef as React.RefObject<HTMLDivElement>}
        />

        <div className="border-t">
          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            onFileSelected={handleFileSelected}
            onVoiceRecorded={handleVoiceRecorded}
            className=""
          />
        </div>
      </div>

      {/* Chat Detail */}
      {isChatDetailVisible && (
        <div className="w-[30%] h-full">
          <ChatDetail
            isOpen={isChatDetailVisible}
            onClose={() => setIsChatDetailVisible(false)}
            chat={chat || conversationDetail}
            members={members}
            currentUser={currentUser}
            groupAdmin={conversationDetail?.groupAdmin}
            files={files}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            addMembers={handleAddMembers}
            removeMember={handleRemoveMember}
            updateGroupInfo={handleUpdateGroupInfo}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMain;
