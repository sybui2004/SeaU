import { formatFileSize } from "./MessageTypes";
import { uploadFile } from "@/api/UploadRequest";

export const getFileType = (
  file: File
): "image" | "audio" | "video" | "other" => {
  const mimeType = file.type.toLowerCase();

  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else if (mimeType.startsWith("video/")) {
    return "video";
  } else {
    return "other";
  }
};

export const createTempFileUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const releaseTempFileUrl = (url: string): void => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export const uploadFileToServer = async (
  file: File,
  fileType: "image" | "audio" | "video" | "other"
): Promise<string> => {
  try {
    console.log(
      `Uploading ${fileType} file: ${file.name} (${formatFileSize(file.size)})`
    );

    const uniqueFileName = `${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    const response = await uploadFile(
      file,
      uniqueFileName,
      fileType === "other" ? "document" : fileType
    );

    console.log("Upload response:", response);

    if (response?.data?.filePath) {
      const filePath = response.data.filePath;

      if (filePath.startsWith("blob:")) {
        console.warn(
          "Server returned an invalid blob URL, using fallback path"
        );
        return constructServerPath(fileType, uniqueFileName);
      }

      return filePath;
    }

    return constructServerPath(fileType, uniqueFileName);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(
      `File upload failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const constructServerPath = (
  fileType: "image" | "audio" | "video" | "other",
  fileName: string
): string => {
  switch (fileType) {
    case "image":
      return `/images/${fileName}`;
    case "audio":
      return `/audio/${fileName}`;
    case "video":
      return `/video/${fileName}`;
    default:
      return `/uploads/${fileName}`;
  }
};

export const getFileDetails = (file: File) => {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: getFileType(file),
    extension: getFileExtension(file.name),
  };
};

export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const audioBlobToFile = (
  audioBlob: Blob,
  fileName = "voice-message.mp3"
): File => {
  return new File([audioBlob], fileName, { type: "audio/mp3" });
};
