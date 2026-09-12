import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { processContent, type AIProvider, type AITask } from "@/lib/ai/processor";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { provider, task, title, content, url, targetLanguage, targetCategory, contentItemId } = body;

  if (!provider || !task || !title || !content) {
    return NextResponse.json({ error: "provider, task, title ve content zorunludur." }, { status: 400 });
  }

  try {
    const result = await processContent(provider as AIProvider, task as AITask, {
      title,
      content,
      url,
      targetLanguage,
      targetCategory,
    });

    // Optionally update the content item in DB
    if (contentItemId) {
      try {
        const mod = await import("@/lib/prisma");
        const prisma = mod.prisma;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).contentItem.update({
          where: { id: contentItemId },
          data: {
            ...(result.content !== content ? { content: result.content } : {}),
            ...(result.summary ? { summary: result.summary } : {}),
            ...(result.category ? { category: result.category } : {}),
          },
        }).catch(() => null);
      } catch {
        // DB unavailable — still return result
      }
    }

    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI işleme hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
