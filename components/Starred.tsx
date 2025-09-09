import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStar } from "@/Context/GlobalContext";
import { useUser } from "@clerk/nextjs";
import FilesTable from "./ui/FilesTable";

const Starred = () => {
  const {
    selectedId,
    starredFileId,
    isStarred,
    setStarredData,
    starredData,
    updateStarredData,
  } = useStar();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchUpdatedStarred = async () => {
      try {
        const response = await axios.get(`/api/files/${userId}/star`, {
          withCredentials: true,
        });
        const result = response.data;

        setStarredData(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpdatedStarred();
  }, [selectedId, isStarred]);
  console.log("isStarred", isStarred);
  return (
    <div>
      <div className="flex justify-between p-5 border-b-2 border-gray-700 mb-5">
        <h2 className="font-bold">Starred Files</h2>
        {/* <button className="bg-gray-700 text-white rounded-xl p-2">
          Refresh
        </button> */}
      </div>
      <FilesTable data={starredData} />
    </div>
  );
};

export default Starred;
