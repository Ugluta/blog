import nodemailer from "nodemailer";

function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Dev: log to console via ethereal-style null transport
  return null;
}

const FROM = process.env.SMTP_FROM ?? "noreply@kurumsal.com";

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const transport = createTransport();

  if (!transport) {
    console.log(`[DEV] Şifre sıfırlama bağlantısı → ${resetUrl}`);
    return;
  }

  await transport.sendMail({
    from: FROM,
    to: email,
    subject: "Şifrenizi Sıfırlayın — Kurumsal",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#f59e0b">Şifre Sıfırlama</h2>
        <p>Aşağıdaki bağlantıya tıklayarak şifrenizi sıfırlayabilirsiniz.
           Bu bağlantı <strong>1 saat</strong> geçerlidir.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;
                  background:#f59e0b;color:#000;border-radius:8px;
                  font-weight:600;text-decoration:none">
          Şifremi Sıfırla
        </a>
        <p style="color:#6b7280;font-size:13px">
          Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
        </p>
      </div>
    `,
  });
}
