import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "KVKK Aydınlatma Metni" };

const SITE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "Platform";

export default function KvkkPage() {
  return (
    <>
      <MegaHeader />
      <main className="min-h-screen bg-[#0a0f1e]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-slate-300">KVKK</span>
          </nav>

          <div className="prose prose-invert prose-amber max-w-none">
            <h1 className="text-2xl font-black text-white mb-2">KVKK Aydınlatma Metni</h1>
            <p className="text-slate-500 text-sm mb-8">Son güncelleme: {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>

            <LegalSection title="1. Veri Sorumlusu">
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla <strong>{SITE}</strong> tarafından işlenecektir.</p>
            </LegalSection>

            <LegalSection title="2. İşlenen Kişisel Veriler">
              <ul>
                <li>Kimlik bilgileri (ad, soyad)</li>
                <li>İletişim bilgileri (e-posta adresi, telefon numarası)</li>
                <li>Kullanıcı işlem bilgileri (giriş geçmişi, kullanıcı adı)</li>
                <li>İşlem güvenliği bilgileri (IP adresi, çerez verileri)</li>
                <li>Finansal bilgiler (ödeme geçmişi — yalnızca abonelik işlemleri için)</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Kişisel Verilerin İşlenme Amaçları">
              <ul>
                <li>Hizmetlerin sunulması ve yönetimi</li>
                <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
                <li>Güvenliğin sağlanması</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>İletişim faaliyetlerinin yürütülmesi</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Kişisel Verilerin Aktarılması">
              <p>Kişisel verileriniz; hizmet sağlayıcılar, iş ortakları ve yetkili kamu kurum ve kuruluşları ile KVKK&apos;nın 8. ve 9. maddeleri kapsamında paylaşılabilir.</p>
            </LegalSection>

            <LegalSection title="5. Haklarınız">
              <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
              <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz hakkında bilgi talep etme</li>
                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmiş kişisel verilerin düzeltilmesini isteme</li>
                <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                <li>Kişisel verilerin işlenmesine itiraz etme</li>
              </ul>
            </LegalSection>

            <LegalSection title="6. İletişim">
              <p>Haklarınızı kullanmak için <Link href="/iletisim" className="text-amber-400 hover:text-amber-300">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.</p>
            </LegalSection>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="text-slate-400 space-y-2 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-slate-200 [&_a]:text-amber-400 [&_a:hover]:text-amber-300">
        {children}
      </div>
    </section>
  );
}
