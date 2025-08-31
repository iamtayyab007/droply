"use client";
import AllFiles from "@/components/AllFiles";
import { SignOutButton } from "@/components/signoutButton";
import Starred from "@/components/Starred";
import Trash from "@/components/Trash";
import FilesTable from "@/components/ui/FilesTable";
import Uploader from "@/components/Uploader";
import UploadFolder from "@/components/UploadFolder";
import { useStar } from "@/Context/GlobalContext";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { CSSProperties, useState } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [activeState, setActiveState] = useState("");
  const [isComponentActive, setIsComponentActive] = useState("");
  const { user, isLoaded } = useUser();
  const userImage = user?.imageUrl;
  const userEmailAddress = user?.primaryEmailAddress?.emailAddress;
  const emailVerification = user?.primaryEmailAddress?.verification.status;
  const accountStatus = user?.id ? "Active" : "unactive";
  const { allFilesData, starredData } = useStar();

  // const fetchFiles = async ({ queryKey }: { queryKey: string[] }) => {
  //   const [_key, userId, parentId] = queryKey;
  //   try {
  //     const res = await axios.get(
  //       `/api/files?userId=${userId}&parentId=${parentId || ""}`
  //     );
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const userId = user?.id ?? "";
  // const parentId = null;

  // const {
  //   data = [],
  //   isLoading,
  //   isError,
  //   isFetching,
  // } = useQuery({
  //   queryKey: ["files", userId, parentId!],
  //   queryFn: fetchFiles,
  //   enabled: isLoaded && !!userId, // still safe
  //   refetchInterval: 5000,
  //   refetchOnMount: true,
  //   staleTime: 0,
  // });

  // if (!isLoaded) return <p>Loading user...</p>;
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-40">
  //       <ClipLoader size={40} color="#4F46E5" />
  //       <span className="ml-3 text-gray-600 text-lg">Loading files...</span>
  //     </div>
  //   );
  // }
  // if (isError) return <p>Failed to load files.</p>;

  // const fetchUserData = async () => {
  //   const response = await axios.get(`/api/files?userId=${user?.id}`);
  //   const result = response.data;
  //   console.log("data", result);
  // };

  // useEffect(() => {
  //   if (!isLoaded || !user) return;
  //   fetchUserData();
  // }, [user, isLoaded]);
  return (
    <>
      {/* <div>
        Welcome {user?.primaryEmailAddress?.emailAddress}! this is the dashboard
      </div> */}
      <div className="w-screen h-screen p-2">
        <div className="flex item-center justify-center gap-5 mb-6 w-[200px] p-2">
          <h1
            className={cn(
              "font-bold cursor-pointer",
              activeState === "files"
                ? "text-green-400 underline decoration-doubled"
                : "text-white"
            )}
            onClick={() => setActiveState("files")}
          >
            My Files
          </h1>
          <h1
            className={cn(
              "font-bold cursor-pointer",
              activeState === "profile"
                ? "text-green-400 underline decoration-doubled"
                : "text-white"
            )}
            onClick={() => setActiveState("profile")}
          >
            Profile
          </h1>
        </div>
        <div
          className={cn(
            "flex",
            activeState === "files"
              ? "justify-between items-start p-3"
              : "justify-center items-center"
          )}
        >
          {/* Left Section */}
          {activeState === "files" ? (
            <>
              <section className="flex flex-col gap-3 w-[30%] border-1 border-gray-800 p-3">
                <h1 className="font-bold p-2">Upload</h1>
                <UploadFolder />
                <Uploader />

                <div className="p-3">
                  <h2 className="text-gray-300">Tips</h2>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Image are private and only visible to you.</li>
                    <li>Supported formats: JPG, PNG, GIF, WebP.</li>
                    <li>Maximum File Size: 5MB.</li>
                  </ul>
                </div>
              </section>
              {/* right Section */}
              <section className="flex flex-col w-[70%] border-1 border-gray-800 p-2">
                <div className="flex items-center gap-2 p-2">
                  <Image
                    src="/file-icon.png"
                    alt="file-icon"
                    width={40}
                    height={40}
                    className="filter invert brightness-0 hue-rotate-180"
                  />
                  <h2 className="text-xl font-semibold mb-4">Your Files</h2>
                </div>
                <div className="flex flex-row justify-around p-3">
                  <div
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isComponentActive === "allfiles"
                        ? "border-b-1 border-blue-500 text-blue-500"
                        : ""
                    )}
                    onClick={() => {
                      setIsComponentActive("allfiles");
                    }}
                  >
                    <Image
                      src="/file-icon.png"
                      alt="file-icon"
                      width={20}
                      height={20}
                      className="filter invert brightness-0 hue-rotate-180"
                    />
                    <h2 className="cursor-pointer font-bold">All Files</h2>
                    <span className="bg-amber-700 rounded p-1 text-white font-bold">
                      {allFilesData && allFilesData.length > 0
                        ? allFilesData.length
                        : ""}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isComponentActive === "starred"
                        ? "border-b-1 border-blue-500 text-blue-500"
                        : ""
                    )}
                    onClick={() => {
                      setIsComponentActive("starred");
                    }}
                  >
                    <FaStar />
                    <h2 className="cursor-pointer">Starred</h2>
                    <span className="bg-amber-700 rounded p-1 text-white font-bold">
                      {starredData && starredData.length > 0
                        ? starredData.length
                        : ""}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isComponentActive === "trash"
                        ? "border-b-1 border-blue-500 text-blue-500"
                        : ""
                    )}
                    onClick={() => {
                      setIsComponentActive("trash");
                    }}
                  >
                    <FaTrash />
                    <h2 className="cursor-pointer">Trash</h2>
                  </div>
                </div>
                {/* <div className="flex justify-between p-5 border-b-2 border-gray-700 mb-5">
                  <h2 className="font-bold">All Files</h2>
                  <button className="bg-gray-700 text-white rounded-xl p-2">
                    Refresh
                  </button>
                </div>
                <div>
                  <FilesTable data={data} />
                </div> */}

                {isComponentActive === "allfiles" && (
                  <>
                    <AllFiles />{" "}
                  </>
                )}
                {isComponentActive === "starred" && <Starred />}
                {isComponentActive === "trash" && <Trash />}
              </section>
            </>
          ) : (
            <div className="border-1 border-gray-700 w-[450px] rounded-xl p-2">
              <div className="flex items-center gap-2 border-b-4 p-2">
                <Image
                  src="/user-icon.png"
                  alt="user-icon"
                  width={40}
                  height={40}
                />
                <h1 className="font-bold">User Profile</h1>
              </div>
              <div className="flex flex-col justify-center items-center p-3 gap-2 pb-3 border-b-2">
                <Image
                  src={userImage || "/user-icon.png"}
                  alt="user-icon"
                  width={80}
                  height={80}
                  className="rounded-4xl"
                />
                <div className="flex items-center gap-2">
                  <Image
                    src={"/gmail.png"}
                    alt="user-icon"
                    width={30}
                    height={30}
                  />
                  <h2 className="text-gray-400">{userEmailAddress}</h2>
                </div>
              </div>
              <div className="flex justify-between p-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={"/risk-management.png"}
                    alt="account-status"
                    width={30}
                    height={30}
                  />{" "}
                  <h2 className="font-bold">Account Status</h2>
                </div>
                <h2 className="bg-green-900 p-1 rounded-sm">{accountStatus}</h2>
              </div>

              <div className="flex justify-between p-2 border-b-2 pb-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={"/gmail.png"}
                    alt="account-status"
                    width={30}
                    height={30}
                  />{" "}
                  <h2 className="font-bold">Email Verification</h2>
                </div>
                <h2 className="bg-green-900 p-1 rounded-sm">
                  {emailVerification}
                </h2>
              </div>
              <div className="flex items-center p-2 mt-3 gap-2 w-[150px] bg-red-900 rounded-xl">
                <Image
                  src={"/logout.png"}
                  alt="logout"
                  width={30}
                  height={30}
                />

                <SignOutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
