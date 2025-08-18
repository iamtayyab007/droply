"use client";
import Uploader from "@/components/Uploader";
import UploadFolder from "@/components/UploadFolder";
import { SignOutButton, useUser } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  const { user } = useUser();
  return (
    <>
      {/* <div>
        Welcome {user?.primaryEmailAddress?.emailAddress}! this is the dashboard
      </div> */}
      <div className="w-screen h-screen p-2">
        <div className="flex item-center gap-5 mb-6">
          <h1>My Files</h1>
          <h1>Profile</h1>
        </div>
        <div className="flex justify-between items-start p-7">
          {/* Left Section */}
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

          {/* Right Section */}
          <section className="flex flex-col w-[50%]">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            {/* Add your files list here */}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
