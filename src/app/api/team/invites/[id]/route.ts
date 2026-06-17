import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
  if (!allowedRoles.includes(session.user.role as string)) {
    return NextResponse.json({ error: "Yetersiz yetki" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.teamInvite.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
