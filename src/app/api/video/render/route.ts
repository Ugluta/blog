import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { auth } from "@/lib/auth";
import { renderVideo, type RenderScene } from "@/lib/video/renderer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { projectId, scenes, musicUrl, aspectRatio } = body as {
    projectId: string;
    scenes: RenderScene[];
    musicUrl?: string;
    aspectRatio: "9:16" | "1:1" | "16:9" | "4:5";
  };

  if (!projectId || !scenes?.length) {
    return NextResponse.json({ error: "projectId ve scenes zorunludur." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any = null;
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    // DB unavailable — proceed without tracking
  }

  if (prisma) {
    await prisma.videoProject.update({
      where: { id: projectId },
      data: { status: "PROCESSING" },
    }).catch(() => null);
  }

  const outputDir = path.join(process.cwd(), "public", "renders");

  try {
    const result = await renderVideo({
      projectId,
      scenes,
      musicUrl,
      aspectRatio: aspectRatio ?? "9:16",
      outputDir,
    });

    if (prisma) {
      await prisma.videoProject.update({
        where: { id: projectId },
        data: {
          status: "READY",
          outputUrl: result.outputUrl,
          duration: result.durationSeconds,
        },
      }).catch(() => null);
    }

    return NextResponse.json({
      ok: true,
      outputUrl: result.outputUrl,
      durationSeconds: result.durationSeconds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Render hatası";

    if (prisma) {
      await prisma.videoProject.update({
        where: { id: projectId },
        data: { status: "FAILED", renderError: message },
      }).catch(() => null);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
