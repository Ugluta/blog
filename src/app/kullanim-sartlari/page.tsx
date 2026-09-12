import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Kullanım Şartları" };

const SITE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "Platform";

export default function KullanimSartlariPage() {
  return (
    <>
      <MegaHeader />
      <main className="min-h-screen bg-[#0a0f1e]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-slate-300">Kullanım Şartları</span>
          </nav>

          <h1 className="text-2xl font-black text-white mb-2">Kullanım Şartları</h1>
          <p className="text-slate-500 text-sm mb-10">Son güncelleme: {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>

          <div className="space-y-8 text-sm text-slate-400 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-white mb-2">1. Kabul</h2>
              <p>Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Kabul etmiyorsanız lütfen siteyi kullanmayınız.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">2. Hizmet Tanımı</h2>
              <p>{SITE}, dijital içerik yönetimi ve yayınlama platformudur. Hizmetin kapsamı önceden haber verilmeksizin değiştirilebilir.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">3. Hesap Sorumluluğu</h2>
              <p>Hesabınızın güvenliğinden ve hesabınız aracılığıyla gerçekleştirilen tüm işlemlerden siz sorumlusunuz. Şüpheli aktivite fark ettiğinizde derhal bize bildirin.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">4. İçerik Politikası</h2>
              <p>Kullanıcılar yasadışı, zararlı, yanıltıcı veya hakaret içeren içerik yayınlayamaz. Bu kurallara aykırı içerikler kaldırılacak ve ilgili hesap askıya alınabilecektir.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">5. Abonelik ve Ödeme</h2>
              <p>Ücretli abonelikler otomatik yenilenir. İptal işlemini bir sonraki faturalama döneminden önce yapmanız gerekmektedir. İptal edilen abonelikler dönem sonuna kadar aktif kalır.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">6. Fikri Mülkiyet</h2>
              <p>Platformdaki tüm içerik ve yazılım {SITE}&apos;a aittir. Yazılı izin olmaksızın çoğaltılamaz, dağıtılamaz veya değiştirilemez.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">7. Sorumluluk Sınırlaması</h2>
              <p>Platform &quot;olduğu gibi&quot; sunulmaktadır. Hizmet kesintileri, veri kayıpları veya dolaylı zararlar dahil olmak üzere herhangi bir kayıptan sorumlu tutulamayız.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">8. Değişiklikler</h2>
              <p>Bu şartları güncelleme hakkımız saklıdır. Değişiklikler sitede yayınlandığında yürürlüğe girer.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">İletişim</h2>
              <p>Sorularınız için <Link href="/iletisim" className="text-amber-400 hover:text-amber-300">iletişim sayfamızı</Link> ziyaret edebilirsiniz.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
