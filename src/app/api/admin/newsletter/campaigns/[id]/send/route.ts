import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const campaign = await prisma.newsletterCampaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Kampanya bulunamadı" }, { status: 404 });
  if (campaign.status === "SENT") return NextResponse.json({ error: "Zaten gönderildi" }, { status: 400 });

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { status: "ACTIVE" },
    select: { email: true, name: true, token: true },
  });

  if (subscribers.length === 0) {
    return NextResponse.json({ error: "Aktif abone yok" }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM ?? smtpUser ?? "noreply@example.com";
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://example.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP yapılandırması eksik" }, { status: 503 });
  }

  await prisma.newsletterCampaign.update({ where: { id }, data: { status: "SENDING" } });

  const transporter = nodemailer.createTransport({
    host: smtpHost, port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  let sentCount = 0;
  for (const sub of subscribers) {
    const unsubLink = `${baseUrl}/api/newsletter/unsubscribe?token=${sub.token}`;
    const html = `${campaign.content}
      <p style="margin-top:32px;font-size:12px;color:#64748b">
        Bu e-postayı almak istemiyorsanız
        <a href="${unsubLink}" style="color:#f59e0b">abonelikten çıkabilirsiniz</a>.
      </p>`;
    try {
      await transporter.sendMail({
        from: `"${process.env.NEXT_PUBLIC_SITE_TITLE ?? "Blog"}" <${fromEmail}>`,
        to: sub.email,
        subject: campaign.subject,
        html,
      });
      sentCount++;
    } catch { /* continue */ }
  }

  await prisma.newsletterCampaign.update({
    where: { id },
    data: { status: "SENT", sentAt: new Date(), sentCount },
  });

  return NextResponse.json({ ok: true, sentCount });
}
