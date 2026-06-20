import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni — EğitimPortal',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında EğitimPortal aydınlatma metni.',
}

const sections = [
  {
    title: '1. Veri Sorumlusu',
    content:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla EğitimPortal ("Platform") tarafından aşağıda açıklanan kapsamda işlenmektedir.',
  },
  {
    title: '2. İşlenen Kişisel Veriler',
    content:
      'Platformumuz üzerinden toplanan kişisel veriler şunlardır: Ad-soyad, e-posta adresi, şifre (hash\'lenmiş), okul/görev bilgisi (isteğe bağlı), yüklenen dosyalar ve bunların meta verileri, IP adresi ve tarayıcı bilgisi, platform içi aktivite kayıtları.',
  },
  {
    title: '3. Kişisel Verilerin İşlenme Amaçları',
    content:
      'Kişisel verileriniz; üyelik hizmetinin sunulması, platform güvenliğinin sağlanması, yasal yükümlülüklerin yerine getirilmesi, kullanıcı deneyiminin iyileştirilmesi ve istatistiksel analizler yapılması amaçlarıyla işlenmektedir.',
  },
  {
    title: '4. Hukuki Dayanak',
    content:
      'Kişisel verileriniz KVKK\'nın 5. maddesi kapsamında; açık rızanız (hesap oluşturma), bir sözleşmenin ifası (hizmet sunumu), meşru menfaat (güvenlik ve istatistik) ve kanuni yükümlülük (vergi, savcılık talepleri) hukuki dayanaklarına istinaden işlenmektedir.',
  },
  {
    title: '5. Kişisel Verilerin Aktarılması',
    content:
      'Kişisel verileriniz; yalnızca teknik altyapı sağlayıcıları (barındırma, e-posta), yapay zeka hizmet sağlayıcısı (Anthropic — yalnızca OCR ve belge oluşturma işlemleri kapsamında ve anonim biçimde) ve yasal zorunluluk halinde yetkili kamu kurumlarıyla paylaşılmaktadır. Bu aktarımlar KVKK\'nın 8. ve 9. maddeleri çerçevesinde gerçekleştirilmektedir.',
  },
  {
    title: '6. Veri Saklama Süresi',
    content:
      'Kişisel verileriniz, üyelik süreniz boyunca ve üyeliğin sonlanmasından itibaren yasal saklama yükümlülükleri kapsamında en fazla 3 yıl süreyle saklanmaktadır. Süre sonunda veriler silinmekte, yok edilmekte veya anonim hale getirilmektedir.',
  },
  {
    title: '7. KVKK\'dan Doğan Haklarınız',
    content:
      'KVKK\'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• İşlenmişse buna ilişkin bilgi talep etme\n• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme\n• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme\n• Eksik veya yanlış işlenmişse düzeltilmesini isteme\n• Silinmesini veya yok edilmesini isteme\n• İşlemeye itiraz etme\n• Zararın giderilmesini talep etme',
  },
  {
    title: '8. Başvuru Yöntemi',
    content:
      'Haklarınızı kullanmak için info@egitimportal.com adresine "KVKK Başvurusu" konusuyla e-posta gönderebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılacaktır. Başvurunuz kimlik doğrulaması gerektiren bir konuyla ilgiliyse ek bilgi talep edilebilir.',
  },
  {
    title: '9. Çerezler (Cookies)',
    content:
      'Platformumuz; oturum yönetimi için zorunlu çerezler ve kullanım istatistikleri için analitik çerezler kullanmaktadır. Zorunlu çerezler platformun çalışması için gerekli olup devre dışı bırakılamaz. Analitik çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.',
  },
  {
    title: '10. Güncellemeler',
    content:
      'Bu aydınlatma metni, mevzuat değişiklikleri veya platform güncellemeleri doğrultusunda güncellenerek yayımlanır. Önemli değişiklikler e-posta ile bildirilir. Son güncelleme: Ocak 2025.',
  },
]

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Yasal</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">KVKK Aydınlatma Metni</h1>
          <p className="text-gray-500 text-[15px]">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin nasıl işlendiğine dair bilgiler.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-[14.5px] text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            Sorularınız için{' '}
            <a href="/iletisim" className="text-blue-600 hover:underline">iletişim sayfamızı</a>{' '}
            ziyaret edebilirsiniz.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
