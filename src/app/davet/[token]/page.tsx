import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = await params;

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { invitedBy: { select: { name: true } } },
  }).catch(() => null);

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-3xl mb-4">⏰</p>
          <h1 className="text-xl font-bold text-white mb-2">Davet Geçersiz</h1>
          <p className="text-slate-400 text-sm mb-6">Bu davet linki süresi dolmuş veya daha önce kullanılmış.</p>
          <Link href="/giris" className="text-amber-400 hover:text-amber-300 text-sm">Giriş Yap →</Link>
        </div>
      </div>
    );
  }

  const session = await auth();

  if (session?.user?.id) {
    // If logged-in user's email matches the invite, accept it
    if (session.user.email === invite.email) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: { role: invite.role },
        }),
        prisma.teamInvite.update({
          where: { token },
          data: { usedAt: new Date() },
        }),
      ]);
      redirect("/uygulama");
    }

    // Logged in as different user — show mismatch message
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-3xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-white mb-2">Hesap Uyuşmazlığı</h1>
          <p className="text-slate-400 text-sm mb-1">
            Bu davet <strong className="text-white">{invite.email}</strong> adresine gönderildi.
          </p>
          <p className="text-slate-500 text-xs mb-6">Şu anda farklı bir hesapla giriş yaptınız.</p>
          <div className="flex gap-2 justify-center">
            <Link href="/giris" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg text-sm transition-colors">
              Doğru Hesapla Gir
            </Link>
            <Link href="/" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors">
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in — show accept UI
  const ROLE_LABEL: Record<string, string> = {
    EDITOR: "Editör",
    PUBLISHER: "Yayıncı",
    VIEWER: "Görüntüleyici",
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <span className="text-4xl">🤝</span>
          <h1 className="text-xl font-bold text-white mt-3 mb-1">Takım Daveti</h1>
          <p className="text-slate-400 text-sm">
            <strong className="text-white">{invite.invitedBy.name ?? "Bir ekip üyesi"}</strong> sizi{" "}
            <span className="text-amber-400 font-semibold">{ROLE_LABEL[invite.role] ?? invite.role}</span> olarak davet etti.
          </p>
          <p className="text-xs text-slate-600 mt-1">Davet: {invite.email}</p>
        </div>

        <div className="space-y-3">
          <Link
            href={`/kayit?invite=${token}&email=${encodeURIComponent(invite.email)}&role=${invite.role}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors"
          >
            Hesap Oluştur ve Katıl
          </Link>
          <Link
            href={`/giris?callbackUrl=${encodeURIComponent(`/davet/${token}`)}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm transition-colors"
          >
            Mevcut Hesapla Giriş Yap
          </Link>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Davet {new Date(invite.expiresAt).toLocaleDateString("tr-TR")} tarihine kadar geçerli.
        </p>
      </div>
    </div>
  );
}
