"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useAuth, useUser } from "@clerk/nextjs";

type AuthParams = {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
};

export default function FileUploadBox() {
  const { getToken } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [fileName, setFileName] = useState<string | "">("");

  const abortController = new AbortController();

  const { user } = useUser();
  const userId = user?.id;

  // imagekit authenticator

  const authenticator = async () => {
    try {
      const response = await axios.get("/api/imagekit-auth");
      return response.data;
    } catch (error: any) {
      console.log(error?.response?.message);
    }
  };

  // Handle click on image area
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpload = async () => {
    setShowProgressBar(true);
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("There is no file, please select a file.");
      setShowProgressBar(false);
      return;
    }
    const file = fileInput.files?.[0];

    let authParams = await authenticator();
    console.log("authparams", authParams);
    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("imagekitresponse", uploadResponse);
      const tokenBearer = await getToken();
      const response = await axios.post(
        "/api/upload",
        {
          userId,
          imagekit: uploadResponse,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenBearer}`, // ✅ Attach token
          },
        }
      );
      console.log("response", response);
    } catch (error: any) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  const handleCancel = () => {
    setPreview(null);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Upload box */}
      <div
        onClick={handleClick}
        className="w-48 h-48 border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center gap-3 cursor-pointer hover:border-blue-500 transition relative"
      >
        {preview ? (
          <>
            <div className="absolute right-1 top-0">
              <button onClick={handleCancel} className="cursor-pointer">
                X
              </button>
            </div>
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded shadow-md"
            />
          </>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
            <p className="text-gray-600 text-sm">Click to upload</p>
            <p className="text-gray-400 text-xs">(PNG, JPG up to 5MB)</p>
          </>
        )}
      </div>
      {fileName}
      {showProgressBar && (
        <div className="flex items-center gap-2">
          {" "}
          Upload Progress: <progress value={progress} max={100}></progress>
          {progress.toFixed()}%
        </div>
      )}

      <button
        className="bg-green-600 rounded-xl p-3 cursor-pointer hover:bg-gray-700"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
