import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const isYouTube = /youtu\.?be/i.test(url);
    const oEmbedUrl = isYouTube
      ? `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      : null;

    if (oEmbedUrl) {
      try {
        const oRes = await fetch(oEmbedUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (oRes.ok) {
          const data = await oRes.json();
          return NextResponse.json({
            image: data.thumbnail_url || null,
            title: data.title || null,
            description: data.author_name ? `By ${data.author_name}` : null,
          });
        }
      } catch {
        /* fall through to HTML scraping */
      }
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ image: null, title: null });
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json({ image: null, title: null });
    }

    const rawBuffer = await res.arrayBuffer();
    const contentTypeHeader = res.headers.get("content-type") || "";
    const charsetMatch = contentTypeHeader.match(/charset=["']?([^"'\s;]+)["']?/i);
    const charset = charsetMatch?.[1] || "utf-8";
    let html: string;
    try {
      html = new TextDecoder(charset, { fatal: false }).decode(rawBuffer);
    } catch {
      html = new TextDecoder("utf-8", { fatal: false }).decode(rawBuffer);
    }

    const ogImage = extractMeta(html, "og:image")
      || extractMeta(html, "twitter:image")
      || extractMeta(html, "twitter:image:src");

    const ogTitle = extractMeta(html, "og:title")
      || extractMeta(html, "twitter:title")
      || extractTagContent(html, "title");

    const ogDescription = extractMeta(html, "og:description")
      || extractMeta(html, "twitter:description")
      || extractMeta(html, "description");

    let imageUrl = ogImage || null;
    if (imageUrl && !imageUrl.startsWith("http")) {
      try {
        imageUrl = new URL(imageUrl, url).href;
      } catch {
        imageUrl = null;
      }
    }

    return NextResponse.json({
      image: imageUrl,
      title: ogTitle || null,
      description: ogDescription || null,
    });
  } catch (error) {
    console.error("OG fetch error:", error);
    return NextResponse.json({ image: null, title: null, description: null });
  }
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]*property=["']${escapeRegex(property)}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${escapeRegex(property)}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*name=["']${escapeRegex(property)}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${escapeRegex(property)}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHTMLEntities(match[1]);
  }
  return null;
}

function extractTagContent(html: string, tag: string): string | null {
  const match = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i"));
  return match?.[1] ? decodeHTMLEntities(match[1].trim()) : null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHTMLEntities(text: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
    nbsp: "\u00A0", copy: "\u00A9", reg: "\u00AE",
    trade: "\u2122", hellip: "\u2026", mdash: "\u2014",
    ndash: "\u2013", laquo: "\u00AB", raquo: "\u00BB",
  };

  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
    .replace(/&([a-zA-Z]+);/g, (full, name) =>
      namedEntities[name.toLowerCase()] ?? full
    );
}
