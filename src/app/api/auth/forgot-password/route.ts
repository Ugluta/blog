import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always return 200 — don't reveal whether the email exists
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email: email.toLowerCase() } });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: email.toLowerCase(), token, expiresAt },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/sifre-sifirla/${token}`;

    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
