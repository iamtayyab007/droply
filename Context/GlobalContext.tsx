"use client";

import React, { createContext, useContext, useState } from "react";

type ContextType = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  isStarred: boolean | null;
  setIsStarred: (value: boolean | null) => void;
};

const StarContext = createContext<ContextType | undefined>(undefined);

export const StarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isStarred, setIsStarred] = useState<boolean | null>(null);

  return (
    <StarContext.Provider
      value={{ selectedId, setSelectedId, isStarred, setIsStarred }}
    >
      {children}
    </StarContext.Provider>
  );
};

export const useStar = () => {
  const context = useContext(StarContext);
  if (!context) {
    throw new Error("useStar must be used within a StarProvider");
  }
  return context;
};
