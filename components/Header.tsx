"use client";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";

const Header = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  console.log("this is the user", user);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 20,
      }}
      className="border-b-2"
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
