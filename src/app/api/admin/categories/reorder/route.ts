import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { items } = await req.json() as { items: { id: string; order: number; parentId?: string | null }[] };
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items gereklidir." }, { status: 400 });
  }

  await Promise.all(
    items.map(({ id, order, parentId }) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma as any).category.update({
        where: { id },
        data: { order, parentId: parentId ?? null },
      }).catch(() => null)
    )
  );

  return NextResponse.json({ ok: true });
}
