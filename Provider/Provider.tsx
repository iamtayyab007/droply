"use client";
import { ImageKitProvider } from "@imagekit/next";
import { Toaster } from "react-hot-toast";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <Toaster />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ImageKitProvider>
  );
};

export default Provider;
