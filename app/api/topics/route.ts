import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import { TOPICS } from "@/types";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const topics = await Bookmark.distinct("topic", { userId: session.user.id });
    const custom = topics.filter((t: string) => !TOPICS.includes(t as typeof TOPICS[number]));

    return NextResponse.json({ custom });
  } catch (error) {
    console.error("GET /api/topics error:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    await connectDB();

    const count = await Bookmark.countDocuments({
      userId: session.user.id,
      topic,
    });

    if (count > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${count} bookmark(s) still use this topic. Reassign them first.` },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Topic removed" });
  } catch (error) {
    console.error("DELETE /api/topics error:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}
