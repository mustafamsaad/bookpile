import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");
    const topic = searchParams.get("topic");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = { userId: session.user.id };
    if (platform && platform !== "all") filter.platform = platform;
    if (topic && topic !== "all") filter.topic = topic;
    if (search) {
      filter.headline = { $regex: search, $options: "i" };
    }

    const bookmarks = await Bookmark.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { headline, url, content, image, platform, customPlatformName, customPlatformIcon, topic } = body;

    if (!headline || !url || !platform || !topic) {
      return NextResponse.json(
        { error: "Headline, URL, platform, and topic are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const bookmark = await Bookmark.create({
      userId: session.user.id,
      headline: headline.trim(),
      url: url.trim(),
      content: content?.trim() || "",
      image: image || "",
      platform,
      customPlatformName: customPlatformName?.trim() || "",
      customPlatformIcon: customPlatformIcon || "",
      topic,
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}
