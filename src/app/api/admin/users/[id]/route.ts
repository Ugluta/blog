import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role, banned } = body;

  // Prevent demoting the last SUPER_ADMIN
  if (role && role !== "SUPER_ADMIN") {
    const current = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (current?.role === "SUPER_ADMIN") {
      const count = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
      if (count <= 1) return NextResponse.json({ error: "Son süper admini düşüremezsiniz" }, { status: 400 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  if (role) data.role = role;
  if (banned !== undefined) data.banned = banned;

  const user = await prisma.user.update({ where: { id }, data, select: { id: true, role: true } });
  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "Kendinizi silemezsiniz" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
