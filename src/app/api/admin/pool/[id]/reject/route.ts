import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: params.id } });
  if (!item) {
    return NextResponse.json({ error: "Öğe bulunamadı" }, { status: 404 });
  }

  await prisma.contentItem.update({
    where: { id: item.id },
    data: { status: "REJECTED", moderatedById: session.userId, failureReason: "Moderatör tarafından reddedildi" },
  });

  return NextResponse.json({ ok: true });
}
