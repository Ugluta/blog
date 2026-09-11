import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const source = await prisma.source.update({
    where: { id: params.id },
    data: {
      ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
      ...(body.name ? { name: body.name } : {}),
      ...(body.url ? { url: body.url } : {}),
    },
  });

  return NextResponse.json({ source });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await prisma.source.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
