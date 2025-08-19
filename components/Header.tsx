"use client";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";

const Header = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600 text-lg">Loading your experience...</p>
    </div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 text-lg">
          sign in to your view your dashboard
        </p>
      </div>
    );
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 20,
      }}
      className="border-b-2 sticky top-0 z-50 bg-black shadow-md"
    >
      <div className="flex items-center gap-2">
        {" "}
        <Image src="/upload-icon.png" alt="icon" width={30} height={30} />
        <h1 className="font-semibold">Droply</h1>
      </div>

      <SignedIn>
        <div className="flex items-center gap-2">
          {user && <p>{user.primaryEmailAddress?.emailAddress}</p>}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </SignedIn>
      <SignedOut>
        <a href="/sign-in">Sign In</a>
      </SignedOut>
    </header>
  );
};

export default Header;
