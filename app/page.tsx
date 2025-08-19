"use client";
import { SignOutButton } from "@/components/signoutButton";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <div>
      Welcome {user.primaryEmailAddress?.emailAddress}!
      <SignOutButton />
    </div>
  );
}
