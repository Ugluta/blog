import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const comment = await prisma.comment.findUnique({ where: { id }, select: { userId: true } });
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string);
  if (comment.userId !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session?.user?.role as string);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();
  const comment = await prisma.comment.update({ where: { id }, data: { status } });
  return NextResponse.json({ comment });
}
