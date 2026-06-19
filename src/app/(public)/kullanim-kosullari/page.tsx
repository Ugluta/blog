import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'ÖğretmenEvrak platformu kullanım koşulları.',
}

export default function KullanimKosullariPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-12 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Koşulları</h1>
          <p className="text-gray-500 text-sm mb-8">Son güncelleme: Ocak 2025</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Kabul</h2>
              <p>
                ÖğretmenEvrak platformunu (<strong>ogretmenevrak.com</strong>) kullanarak bu Kullanım Koşulları&apos;nı
                kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız platformu kullanmayınız.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Hizmet Tanımı</h2>
              <p>
                ÖğretmenEvrak, öğretmenler ve eğitim çalışanları için ders planı, yıllık plan, sınav sorusu ve
                evrak örneği gibi eğitim materyallerinin paylaşıldığı ve indirilebildiği ücretsiz bir platformdur.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Üyelik</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kayıt sırasında doğru ve güncel bilgi vermekle yükümlüsünüz.</li>
                <li>Hesabınızın güvenliğinden siz sorumlusunuz; şifrenizi kimseyle paylaşmayın.</li>
                <li>Her kullanıcı yalnızca bir hesap açabilir.</li>
                <li>18 yaşından küçük kullanıcılar platforma kayıt olamaz.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. İçerik Kuralları</h2>
              <p className="mb-2">Platforma yüklediğiniz içeriklerin:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Telif hakkı ihlali içermemesi,</li>
                <li>Başkalarına ait materyalleri izinsiz kullanmaması,</li>
                <li>Zararlı, yanıltıcı veya uygunsuz içerik barındırmaması</li>
              </ul>
              <p className="mt-2">
                gerekmektedir. Kurallara aykırı içerikler kaldırılır ve hesabınız askıya alınabilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Fikri Mülkiyet</h2>
              <p>
                Platform altyapısı, tasarım ve özgün içeriklerin hakları ÖğretmenEvrak&apos;a aittir. Kullanıcı
                tarafından yüklenen içeriklerin telif hakları içeriği yükleyen kullanıcıya ait olmakla birlikte,
                yükleme işlemiyle platformun bu içeriği tüm kullanıcılara sunmasına onay verilmiş sayılır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Hizmetin Değiştirilmesi</h2>
              <p>
                ÖğretmenEvrak, önceden bildirim yapmaksızın hizmet kapsamını, fiyatlandırmayı veya bu koşulları
                değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı tarihten itibaren geçerlidir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Sorumluluk Sınırı</h2>
              <p>
                Platform, kullanıcılar tarafından yüklenen içeriklerin doğruluğu veya güncelliği konusunda garanti
                vermemektedir. İçerikler bilgi amaçlıdır; resmi eğitim belgesi niteliği taşımaz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Hesap Kapatma</h2>
              <p>
                Koşulları ihlal eden hesaplar uyarı yapılmaksızın kapatılabilir. Hesabınızı kendiniz kapatmak için{' '}
                <a href="mailto:destek@ogretmenevrak.com" className="text-blue-600 hover:underline">
                  destek@ogretmenevrak.com
                </a>{' '}
                adresine başvurabilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Uygulanacak Hukuk</h2>
              <p>
                Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. İletişim</h2>
              <p>
                Sorularınız için:{' '}
                <a href="mailto:destek@ogretmenevrak.com" className="text-blue-600 hover:underline">
                  destek@ogretmenevrak.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
