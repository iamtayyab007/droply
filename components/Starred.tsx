import React, { useEffect } from "react";
import axios from "axios";
import { useStar } from "@/Context/GlobalContext";

const Starred = () => {
  const { selectedId, setIsStarred } = useStar();

  useEffect(() => {
    const fetchUpdatedStarred = async () => {
      try {
        const response = await axios.get(`/api/files/${selectedId}/star`);
        const result = response.data;
        const isStarred = result.isStarred;
        setIsStarred(isStarred);
        console.log("isStarredResponse", isStarred);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUpdatedStarred();
  }, [selectedId]);

  return (
    <div>
      <div className="flex justify-between p-5 border-b-2 border-gray-700 mb-5">
        <h2 className="font-bold">Starred Files</h2>
        {/* <button className="bg-gray-700 text-white rounded-xl p-2">
          Refresh
        </button> */}
      </div>
    </div>
  );
};

export default Starred;
