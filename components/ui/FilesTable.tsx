"use client";

import React from "react";
import { FaStar } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  fileUrl: string;
  createdAt: string;
  thumbnailUrl: string;
}

export default function FilesTable({ data }: { data: FileData[] }) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  // handle download
  const handleDownload = async (linked: string) => {
    console.log("info", linked);
    try {
      const response = await fetch(linked);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = linked.split("/").pop() || "download"; // Extract filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ✅ Define columns
  const columnHelper = createColumnHelper<FileData>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => {
        const row = info.row.original; // Access full row data
        const originalName = row.name;
        const cleanedName = originalName.replace(/_[^_]+\.(\w+)$/, ".$1");

        return (
          <div className="flex items-center gap-3 w-full max-w-[450px]">
            {row.thumbnailUrl ? (
              <img
                src={row.thumbnailUrl}
                alt={info.getValue()}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 flex items-center justify-center rounded">
                📄
              </div>
            )}
            <span className="font-medium">{cleanedName}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => `${info.getValue()}`,
    }),
    columnHelper.accessor("size", {
      header: "Size (KB)",
      // cell: (info) => `${info.getValue()} KB`,
      cell: (info) => {
        const sizeInBytes = info.getValue();
        const sizeInKb = sizeInBytes / 1024;
        return `${sizeInKb.toFixed()} KB`;
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Added",
      cell: (info) => {
        const dateString = new Date(info.getValue());

        const formattedDate = dateString.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const now = new Date();
        const diffInSeconds = Math.floor(
          (now.getTime() - dateString.getTime()) / 1000
        );
        let formattedTime = "";
        if (diffInSeconds < 60) {
          formattedTime = `Added ${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          formattedTime = `Added ${minutes} minute${
            minutes > 1 ? "s" : ""
          } ago`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          formattedTime = `Added ${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
          const days = Math.floor(diffInSeconds / 86400);
          formattedTime = `Added ${days} day${days > 1 ? "s" : ""} ago`;
        }

        return (
          <>
            <p className="text-xs font-bold">
              {formattedTime} <br /> {formattedDate}
            </p>
          </>
        );
      },
    }),

    columnHelper.accessor("fileUrl", {
      header: "Action",
      cell: (info) => (
        <>
          <a
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          ></a>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1">
              <button
                className="bg-amber-400 p-1 rounded no-underline text-black cursor-pointer flex items-center gap-1"
                onClick={() => handleDownload(info.getValue())}
              >
                <FaDownload />
                Download
              </button>

              <button className="bg-blue-400 p-1 rounded no-underline text-black cursor-pointer flex items-center gap-1">
                <FaStar /> Star
              </button>
            </div>

            <button className="bg-red-400 p-1 rounded no-underline text-black cursor-pointer flex items-center gap-1">
              <FaTrash />
              Delete
            </button>
          </div>
        </>
      ),
    }),
  ];

  // ✅ Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false, // Set true if using server-side pagination
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  return (
    <div className="overflow-x-auto">
      <table className="border w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-4 py-2 text-left bg-gray-900"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
