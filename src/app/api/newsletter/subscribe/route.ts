import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() || null;
  const source = body.source ?? "web";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Geçersiz e-posta adresi" }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, name, token, source, status: "ACTIVE" },
    update: { name: name ?? undefined, status: "ACTIVE", token },
  });

  return NextResponse.json({ ok: true });
}
