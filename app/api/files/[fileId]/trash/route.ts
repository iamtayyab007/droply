import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { file } from "zod";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { fileId } = await props.params;
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "file not found" }, { status: 401 });
    }

    const updatedFiles = await db
      .update(files)
      .set({ isTrash: !file.isTrash })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    const updatedFile = updatedFiles[0];

    return NextResponse.json(updatedFile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update the file" },
      { status: 401 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(files)
      .where(eq(files.userId, userId));
    const isTrash = result[0].isTrash;

    return NextResponse.json(isTrash);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.message },
      { status: 401 }
    );
  }
}
