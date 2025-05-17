import React, {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaFileUpload, FaMicrophone, FaStop } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { Progress } from "@/components/ui/progress";

interface ChatInputProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  handleSend: () => void;
  isHovered: { addMember: boolean; chatMessage: boolean };
  setIsHovered: Dispatch<
    SetStateAction<{ addMember: boolean; chatMessage: boolean }>
  >;
  className?: string;
  onFileSelected?: (file: File) => void;
  onVoiceRecorded?: (audioBlob: Blob) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  isHovered,
  setIsHovered,
  className,
  onFileSelected,
  onVoiceRecorded,
}) => {
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileSelected) {
        onFileSelected(selectedFile);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      setFile(null);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        if (onVoiceRecorded) {
          onVoiceRecorded(audioBlob);
        }

        stream.getTracks().forEach((track) => track.stop());

        setRecordingTime(0);
        setRecordingProgress(0);

        setTimeout(() => {
          handleSend();
        }, 500);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          const progress = (newTime / 60) * 100;
          setRecordingProgress(Math.min(progress, 100));

          if (newTime >= 60) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Cannot access microphone. Please check your access permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const onSend = () => {
    handleSend();
    setFile(null);
    setShowEmoji(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`p-4 ${className || ""}`}>
      {isRecording && (
        <div className="mb-2 p-2 bg-red-50 rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-red-500 font-medium">Recording...</span>
            <span className="text-sm text-gray-600">
              {formatRecordingTime(recordingTime)}
            </span>
          </div>
          <Progress value={recordingProgress} className="h-1 bg-gray-200" />
        </div>
      )}
      <div className="flex items-center">
        <div className="relative mr-3">
          <button
            type="button"
            className={`text-xl text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full ${
              showEmoji ? "bg-blue-100" : ""
            }`}
            onClick={() => setShowEmoji(!showEmoji)}
            aria-label="Choose emoji"
            title="Choose emoji"
          >
            <BsEmojiSmile />
          </button>
          {showEmoji && (
            <div className="absolute bottom-12 left-0 z-10 shadow-lg rounded-lg">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setMessage((prev) => prev + emojiData.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>
        <div className="mr-3">
          <button
            type="button"
            className="text-xl text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full"
            onClick={handleOpenFileDialog}
            aria-label="Attach file"
            title="Attach file"
          >
            <FaFileUpload />
          </button>
          <input
            className="hidden"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            aria-label="Choose file"
            title="Choose file"
          />
        </div>
        <div className="mr-3">
          <button
            type="button"
            className={`text-xl transition-colors p-2 rounded-full ${
              isRecording
                ? "text-red-500 bg-red-100"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop recording" : "Record message"}
            title={isRecording ? "Stop recording" : "Record message"}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </button>
        </div>

        <div className="flex-1 relative">
          {file && (
            <div className="mb-2 p-2 bg-blue-50 rounded flex items-center justify-between">
              <span className="text-sm truncate max-w-[80%]">{file.name}</span>
              <button
                className="text-red-500 hover:text-red-700 text-sm"
                onClick={() => setFile(null)}
              >
                ×
              </button>
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={file ? "Add description..." : "Enter message..."}
            className={`w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 transition-all duration-300 resize-none overflow-hidden ${
              isHovered.chatMessage
                ? "focus:ring-blue-400 border-blue-300"
                : "focus:ring-gray-300"
            }`}
            rows={1}
            onFocus={() =>
              setIsHovered((prev) => ({ ...prev, chatMessage: true }))
            }
            onBlur={() =>
              setIsHovered((prev) => ({ ...prev, chatMessage: false }))
            }
          />
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer p-2 rounded-full ${
              message.trim() || file
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={onSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
