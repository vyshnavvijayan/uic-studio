import { NextRequest, NextResponse } from "next/server";
import { getPublishedContent, getDraftContent, saveDraftContent, publishContent, validateMediaUrl } from "@/lib/content-service";
import { SiteContent } from "@/types/content";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");

  try {
    if (mode === "draft") {
      const draft = await getDraftContent();
      return NextResponse.json(draft);
    }
    const published = await getPublishedContent();
    return NextResponse.json(published);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, content, expectedRevision } = body as {
      action: "draft" | "publish";
      content: SiteContent;
      expectedRevision?: number;
    };

    if (!content || !content.brand || !content.sections) {
      return NextResponse.json({ error: "Invalid content structure provided." }, { status: 400 });
    }

    // Validate media URLs in hero and work sections
    if (content.sections.hero.posterUrl && !validateMediaUrl(content.sections.hero.posterUrl)) {
      return NextResponse.json({ error: "Invalid hero poster URL." }, { status: 400 });
    }

    if (action === "publish") {
      const result = await publishContent(content, expectedRevision);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    } else {
      const result = await saveDraftContent(content);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error processing request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
