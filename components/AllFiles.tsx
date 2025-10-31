import React from "react";
import FilesTable from "./ui/FilesTable";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { useStar } from "@/Context/GlobalContext";

const AllFiles = () => {
  const { user, isLoaded } = useUser();
  const { allFilesData, setAllFilesData } = useStar();

  const fetchFiles = async ({ queryKey }: { queryKey: string[] }) => {
    const [_key, userId, parentId] = queryKey;
    try {
      const res = await axios.get(
        `/api/files?userId=${userId}&parentId=${parentId || ""}`
      );
      setAllFilesData(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const userId = user?.id ?? "";
  const parentId = null;

  const {
    data = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["files", userId, parentId!],
    queryFn: fetchFiles,
    enabled: isLoaded && !!userId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 5000,
    placeholderData: keepPreviousData, // optional
  });

  if (!isLoaded) return <p>Loading user...</p>;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ClipLoader size={40} color="#4F46E5" />
        <span className="ml-3 text-gray-600 text-lg">Loading files...</span>
      </div>
    );
  }
  if (isError) return <p>Failed to load files.</p>;

  return (
    <div>
      <div className="flex justify-between p-5 border-b-2 border-gray-700 mb-5">
        <h2 className="font-bold">All Files</h2>
        <button className="bg-gray-700 text-white rounded-xl p-2">
          Refresh
        </button>
      </div>
      <div>
        <FilesTable data={data} filterType="all" />
      </div>
    </div>
  );
};

export default AllFiles;
