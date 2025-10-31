"use client";

import React, { createContext, useContext, useState } from "react";
interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  fileUrl: string;
  createdAt: string;
  thumbnailUrl: string;
  isStarred: boolean;
  isTrash: boolean;
}
type ContextType = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  isStarred: boolean | null;
  setIsStarred: (value: boolean | null) => void;
  starredFileId: string | null;
  setStarredFileId: (value: string | null) => void;
  allFilesData: FileData[];
  setAllFilesData: (value: FileData[]) => void;
  starredData: FileData[];
  setStarredData: (value: FileData[]) => void;
  updateStarredData: FileData[];
  setUpdateStarredData: React.Dispatch<React.SetStateAction<FileData[]>>;
  trashItems: FileData[];
  setTrashItems: React.Dispatch<React.SetStateAction<FileData[]>>;
};

const StarContext = createContext<ContextType | undefined>(undefined);

export const StarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isStarred, setIsStarred] = useState<boolean | null>(false);
  const [starredFileId, setStarredFileId] = useState<string | null>(null);
  const [allFilesData, setAllFilesData] = useState<FileData[]>([]);
  const [starredData, setStarredData] = useState<FileData[]>([]);
  const [updateStarredData, setUpdateStarredData] = useState<FileData[]>([]);
  const [trashItems, setTrashItems] = useState<FileData[]>([]);

  return (
    <StarContext.Provider
      value={{
        selectedId,
        setSelectedId,
        isStarred,
        setIsStarred,
        starredFileId,
        setStarredFileId,
        allFilesData,
        setAllFilesData,
        starredData,
        setStarredData,
        updateStarredData,
        setUpdateStarredData,
        trashItems,
        setTrashItems,
      }}
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
