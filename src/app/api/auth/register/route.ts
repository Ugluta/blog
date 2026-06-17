import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  let prisma: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const mod = await import("@/lib/prisma");
    prisma = mod.prisma;
  } catch {
    return NextResponse.json({ error: "Veritabanı bağlantısı kurulamadı." }, { status: 503 });
  }

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { name, email, password } = body;

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Ad, e-posta ve şifre zorunludur." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      role: "VIEWER",
    },
  });

  // Free plan subscription created automatically
  const freePkg = await prisma.package.findUnique({ where: { slug: "free" } }).catch(() => null);
  if (freePkg) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        packageId: freePkg.id,
        status: "ACTIVE",
        billingPeriod: "MONTHLY",
        autoRenew: false,
      },
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
