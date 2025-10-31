import { useStar } from "@/Context/GlobalContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";
import FilesTable from "./ui/FilesTable";

const Trash = () => {
  const { trashItems, setTrashItems, selectedId } = useStar();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchUpdatedStarred = async () => {
      try {
        const response = await axios.get(`/api/files/${userId}/trash`, {
          withCredentials: true,
        });
        const result = response.data;
        setTrashItems(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpdatedStarred();
  }, [selectedId]);
  console.log("trashItems", trashItems);
  return (
    <div>
      <div className="flex justify-between p-5 border-b-2 border-gray-700 mb-5">
        <h2 className="font-bold">Trash Files</h2>
      </div>
      <FilesTable data={trashItems} filterType="trash" />
    </div>
  );
};

export default Trash;
