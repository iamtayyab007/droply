"use client";
import { SignOutButton } from "@/components/signoutButton";
import Uploader from "@/components/Uploader";
import UploadFolder from "@/components/UploadFolder";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [activeState, setActiveState] = useState("");
  const { user, isLoaded } = useUser();
  const userImage = user?.imageUrl;
  const userEmailAddress = user?.primaryEmailAddress?.emailAddress;
  const emailVerification = user?.primaryEmailAddress?.verification.status;
  const accountStatus = user?.id ? "Active" : "unactive";

  const fetchUserData = async () => {
    const response = await axios.get(`/api/files?userId=${user?.id}`);
    const result = response.data;
    console.log("data", result);
  };

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchUserData();
  }, [user, isLoaded]);
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
              <section className="flex flex-col gap-3 w-[40%] border-1 border-gray-800 p-3">
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
              <section className="flex flex-col w-[60%] border-1 border-gray-800">
                <div className="flex items-center gap-2 border-b-1 p-2">
                  <Image
                    src="/file-icon.png"
                    alt="file-icon"
                    width={40}
                    height={40}
                    className="filter invert brightness-0 hue-rotate-180"
                  />
                  <h2 className="text-xl font-semibold mb-4">Your Files</h2>
                </div>
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
