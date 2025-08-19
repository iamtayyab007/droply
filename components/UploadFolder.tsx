import Image from "next/image";
import React from "react";

const UploadFolder = () => {
  return (
    <div>
      <button className="bg-blue-600 flex items-center gap-2 p-3 rounded-2xl cursor-pointer">
        <Image src="/folder.png" alt="folder" width={20} height={20} />
        New Folder
      </button>
    </div>
  );
};

export default UploadFolder;
