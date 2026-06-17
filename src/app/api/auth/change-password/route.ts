import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Eksik alan." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }

  const user = await prisma.user
    .findUnique({ where: { id: session.user.id }, select: { password: true } })
    .catch(() => null);

  if (!user?.password) {
    return NextResponse.json({ error: "Bu hesap sosyal giriş kullanıyor, şifre ayarlanamaz." }, { status: 400 });
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hash } });

  return NextResponse.json({ ok: true });
}
