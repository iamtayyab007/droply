"use client";

import { auth } from "@clerk/nextjs/server";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Uploader = async () => {
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("No File Chosen");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userId } = await auth();

  //const abortController = new AbortController();

  /**
   * Fetch authentication parameters from the backend API.
   */

  // const authenticator = async () => {
  //   try {
  //     const response = await fetch("/api/imagekit-auth");

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Request failed with status ${response.status}: ${errorText}`
  //       );
  //     }

  //     const data = await response.json();
  //     const { signature, expire, token } = data;

  //     if (!signature || !expire || !token) {
  //       throw new Error("Missing authentication data from server");
  //     }

  //     return { signature, expire, token };
  //   } catch (error) {
  //     console.error("Authentication error:", error);
  //     throw new Error("Authentication request failed");
  //   }
  // };

  /**
   * Handle file upload.
   */
  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // let authParams;
    // try {
    //   authParams = await authenticator();
    // } catch (authError) {
    //   console.error("Failed to authenticate for upload:", authError);
    //   return;
    // }
    // const { signature, expire, token } = authParams;

    // // ✅ Get public key from environment variable
    // const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    // if (!publicKey) {
    //   console.error("Missing NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY in environment");
    //   return;
    // }

    //   try {
    //     const uploadResponse = await upload({
    //       file,
    //       fileName: file.name,
    //       publicKey,
    //       signature,
    //       token,
    //       expire,
    //       onProgress: (event) => {
    //         setProgress((event.loaded / event.total) * 100);
    //       },
    //       abortSignal: abortController.signal,
    //     });
    //     console.log("Upload response:", uploadResponse);
    //     toast.success("File uploaded successfully!");
    //   } catch (error) {
    //     if (error instanceof ImageKitAbortError) {
    //       toast.error(`Something went wrong! ${error.message}`);
    //       console.error("Upload aborted:", error.reason);
    //     } else if (error instanceof ImageKitInvalidRequestError) {
    //       console.error("Invalid request:", error.message);
    //     } else if (error instanceof ImageKitUploadNetworkError) {
    //       console.error("Network error:", error.message);
    //     } else if (error instanceof ImageKitServerError) {
    //       console.error("Server error:", error.message);
    //     } else {
    //       console.error("Upload error:", error);
    //     }
    //   }
    // };

    const handleChange = () => {
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        // Get the name of the first selected file
        const fileNameSpace = fileInput.files[0].name;
        setFileName(fileNameSpace);
      }
    };
    return (
      <>
        <div className="image-upload flex items-center gap-2">
          <label htmlFor="file-input">
            <Image
              src="/upload-icon.png"
              alt="icon-upload"
              height={50}
              width={50}
              className="cursor-pointer"
            />
          </label>

          <input
            id="file-input"
            style={{ display: "none" }}
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
          />

          <p>{fileName}</p>

          <button
            type="button"
            onClick={handleUpload}
            className="bg-gray-700 rounded-2xl p-3 cursor-pointer"
          >
            Upload file
          </button>
        </div>
        <br />
        {fileName === "No File Chosen" ? (
          ""
        ) : (
          <div className="flex items-center gap-2">
            Upload progress:
            <progress
              value={progress}
              max={100}
              style={{ accentColor: "#ff5733" }}
            ></progress>
            {progress ? progress.toFixed() + "%" : ""}
          </div>
        )}
      </>
    );
  };
};
export default Uploader;
