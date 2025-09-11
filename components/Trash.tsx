import { useStar } from "@/Context/GlobalContext";
import React from "react";

const Trash = () => {
  const { deleteDataItems, setDeleteDataItems } = useStar();
  return (
    <div>
      <div className="flex justify-between p-5 border-b-2 border-gray-700 mb-5">
        <h2 className="font-bold">Trash Files</h2>
      </div>
    </div>
  );
};

export default Trash;
