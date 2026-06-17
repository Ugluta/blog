import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { auth } from "@/lib/auth";
import { synthesizeSpeech, type TTSProvider } from "@/lib/tts/provider";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { text, provider, voice, language } = body as {
    text: string;
    provider?: TTSProvider;
    voice?: string;
    language?: string;
  };

  if (!text?.trim()) {
    return NextResponse.json({ error: "text zorunludur." }, { status: 400 });
  }

  if (text.length > 5000) {
    return NextResponse.json({ error: "Metin 5000 karakterden uzun olamaz." }, { status: 400 });
  }

  try {
    const result = await synthesizeSpeech({ text, provider, voice, language });

    // Save MP3 to public/tts/<hash>.mp3
    const hash = Buffer.from(text.slice(0, 64)).toString("hex").slice(0, 16);
    const filename = `${hash}_${Date.now()}.mp3`;
    const outputDir = path.join(process.cwd(), "public", "tts");
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, filename), result.audioBuffer);

    return NextResponse.json({
      ok: true,
      audioUrl: `/tts/${filename}`,
      provider: result.provider,
      durationEstimateSeconds: result.durationEstimateSeconds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
