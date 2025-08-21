import { NewFile } from "./../../../../lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import ImageKit from "imagekit";
import { files } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// imagekit credentials
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // parse formData
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    let parentId = (formData.get("parentId") as string) || null;

    if (
      !parentId ||
      parentId === "null" ||
      parentId === "undefined" ||
      parentId === ""
    ) {
      parentId = null;
    }

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json(
        { error: "Please upload the file" },
        { status: 401 }
      );
    }
    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
    } else {
      return NextResponse.json(
        { error: "parent folder not found" },
        { status: 401 }
      );
    }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "only images and pdf supported" },
        { status: 401 }
      );
    }
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/droply/${userId}/folder/${parentId}`
      : `/droply/${userId}`;

    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop() || "";
    // check for empty extension
    if (!fileExtension) {
      return NextResponse.json(
        {
          error: "the file has not extension or missing",
        },
        { status: 401 }
      );
    }
    // validation for not checking exe, php
    if (fileExtension === "exe" || fileExtension === "php") {
      return NextResponse.json(
        {
          error: `${fileExtension} not allowed`,
        },
        { status: 401 }
      );
    }
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFilename,
      folder: folderPath,
      useUniqueFileName: false,
    });

    const fileData = {
      name: originalFilename,
      path: uploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId: userId,
      parentId: parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (error) {
    return NextResponse.json(
      { error: "failed to upload a file" },
      { status: 401 }
    );
  }
}
