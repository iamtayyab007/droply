import { ImageKitProvider } from "@imagekit/next";
import { Toaster } from "react-hot-toast";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <Toaster />
      {children}
    </ImageKitProvider>
  );
};

export default Provider;
