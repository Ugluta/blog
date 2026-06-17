import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  const allowed = ["name", "slug", "description", "icon", "color", "image", "parentId", "order", "isActive", "categoryType"];
  for (const key of allowed) {
    if (key in body) {
      updateData[key] = body[key] === "" ? null : body[key];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await (prisma as any).category.update({
    where: { id },
    data: updateData,
  }).catch((e: { code?: string }) => {
    if (e.code === "P2025") return null;
    throw e;
  });

  if (!category) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children = await (prisma as any).category.findMany({ where: { parentId: id } }).catch(() => []);
  if (children.length > 0) {
    return NextResponse.json(
      { error: "Bu kategorinin alt kategorileri var. Önce alt kategorileri silin veya taşıyın." },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).category.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
