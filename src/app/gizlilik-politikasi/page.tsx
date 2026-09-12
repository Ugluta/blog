import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Gizlilik Politikası" };

export default function GizlilikPage() {
  return (
    <>
      <MegaHeader />
      <main className="min-h-screen bg-[#0a0f1e]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-slate-300">Gizlilik Politikası</span>
          </nav>

          <h1 className="text-2xl font-black text-white mb-2">Gizlilik Politikası</h1>
          <p className="text-slate-500 text-sm mb-10">Son güncelleme: {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>

          <div className="space-y-8 text-sm text-slate-400 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-white mb-2">Çerezler</h2>
              <p>Sitemiz, temel işlevler ve analiz amaçlı çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bazı özellikler çalışmayabilir.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">Veri Toplama</h2>
              <p>Kayıt olduğunuzda e-posta adresinizi ve seçtiğiniz şifreyi saklarız. Ödeme bilgileri doğrudan ödeme işlemcimiz tarafından işlenir; kredi kartı bilgileriniz sistemlerimizde saklanmaz.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">Üçüncü Taraf Hizmetler</h2>
              <p>Google Analytics, Stripe ve benzeri üçüncü taraf hizmetler kendi gizlilik politikaları kapsamında veri işleyebilir.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">Veri Güvenliği</h2>
              <p>Verilerinizin güvenliğini sağlamak için endüstri standartlarında şifreleme ve güvenlik önlemleri kullanmaktayız.</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-white mb-2">İletişim</h2>
              <p>Gizlilik politikamız hakkında sorularınız için <Link href="/iletisim" className="text-amber-400 hover:text-amber-300">iletişim sayfamızı</Link> ziyaret edebilirsiniz.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
