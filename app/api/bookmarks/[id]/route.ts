import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const bookmark = await Bookmark.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!bookmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("GET /api/bookmarks/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmark" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    const { id } = await params;

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      {
        headline: body.headline?.trim(),
        url: body.url?.trim(),
        content: body.content?.trim() || "",
        image: body.image || "",
        platform: body.platform,
        customPlatformName: body.customPlatformName?.trim() || "",
        customPlatformIcon: body.customPlatformIcon || "",
        topic: body.topic,
      },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!bookmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("PUT /api/bookmarks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const bookmark = await Bookmark.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!bookmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bookmark deleted" });
  } catch (error) {
    console.error("DELETE /api/bookmarks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
