import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { name, bio } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Ad zorunludur." }, { status: 400 });

  const user = await prisma.user
    .update({
      where: { id: session.user.id },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    })
    .catch(() => null);

  if (!user) return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });

  // bio is not in the schema yet — ignored silently
  void bio;

  return NextResponse.json({ user });
}
