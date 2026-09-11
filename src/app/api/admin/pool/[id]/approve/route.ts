import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { publishContentItem } from "@/lib/publish";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: params.id } });
  if (!item || item.status !== "IN_REVIEW") {
    return NextResponse.json({ error: "Öğe onay için uygun değil" }, { status: 400 });
  }

  await prisma.contentItem.update({
    where: { id: item.id },
    data: { moderatedById: session.userId },
  });

  await publishContentItem(item);

  return NextResponse.json({ ok: true });
}
