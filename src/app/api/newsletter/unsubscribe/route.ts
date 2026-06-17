import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token gerekli" }, { status: 400 });

  const sub = await prisma.newsletterSubscriber.findUnique({ where: { token } });
  if (!sub) return NextResponse.json({ error: "Geçersiz token" }, { status: 404 });

  await prisma.newsletterSubscriber.update({ where: { token }, data: { status: "UNSUBSCRIBED" } });

  return new Response(
    `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>Abonelik İptal</title></head>
    <body style="font-family:sans-serif;background:#0a0f1e;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
    <div style="text-align:center"><h1 style="color:#f59e0b">Abonelik İptal Edildi</h1>
    <p style="color:#94a3b8">E-posta listemizden başarıyla çıkarıldınız.</p>
    <a href="/" style="color:#f59e0b">Ana sayfaya dön</a></div></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
