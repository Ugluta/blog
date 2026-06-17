import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
const INVITE_ROLES = ["EDITOR", "PUBLISHER", "VIEWER"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (!ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ error: "Yetersiz yetki" }, { status: 403 });
  }

  const [members, invites] = await Promise.all([
    prisma.user.findMany({
      where: { role: { not: "VIEWER" } },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }).catch(() => []),
    prisma.teamInvite.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      include: { invitedBy: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
  ]);

  return NextResponse.json({ members, invites });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (!ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ error: "Yetersiz yetki" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !role) return NextResponse.json({ error: "E-posta ve rol zorunlu" }, { status: 400 });
  if (!INVITE_ROLES.includes(role)) return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } }).catch(() => null);
  if (existing) return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.teamInvite.create({
    data: { email, role: role as "EDITOR" | "PUBLISHER" | "VIEWER", invitedById: session.user.id, expiresAt },
  });

  const inviteUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/davet/${invite.token}`;

  // Send email if nodemailer is configured
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME ?? "KURUMSAL"}" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
      to: email,
      subject: "Takım Daveti — KURUMSAL",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#f59e0b">Takım Daveti</h2>
          <p>${session.user.name ?? "Bir ekip üyesi"} sizi KURUMSAL platformuna <strong>${role}</strong> rolüyle davet etti.</p>
          <p><a href="${inviteUrl}" style="display:inline-block;padding:10px 20px;background:#f59e0b;color:#000;text-decoration:none;border-radius:8px;font-weight:bold">Daveti Kabul Et</a></p>
          <p style="color:#666;font-size:12px">Bu davet 7 gün içinde geçerliliğini yitirecek.</p>
        </div>
      `,
    });
  } catch {
    // Email not configured — invite still created
  }

  return NextResponse.json({ invite: { id: invite.id, email, role, token: invite.token, inviteUrl } }, { status: 201 });
}
