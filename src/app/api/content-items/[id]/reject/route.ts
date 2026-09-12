import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.contentItem
    .update({ where: { id }, data: { status: "rejected" } })
    .catch(() => null);

  if (!item) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ item });
}
