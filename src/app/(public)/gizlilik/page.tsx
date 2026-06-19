import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'ÖğretmenEvrak gizlilik politikası ve KVKK kapsamında kişisel verilerin korunması.',
}

export default function GizlilikPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-12 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
          <p className="text-gray-500 text-sm mb-8">Son güncelleme: Ocak 2025</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
            <p>
              ÖğretmenEvrak olarak kişisel verilerinizin güvenliğini önemsiyoruz. Bu politika, 6698 sayılı
              Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmıştır.
            </p>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Toplanan Veriler</h2>
              <p className="mb-2">Kayıt ve hizmet süreçlerinde şu veriler toplanmaktadır:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Kimlik bilgileri:</strong> Ad soyad, e-posta adresi</li>
                <li><strong>Mesleki bilgiler:</strong> Görev türü, okul türü, çalışılan okul adı (isteğe bağlı)</li>
                <li><strong>Kullanım verileri:</strong> Giriş zamanları, indirilen dosyalar, görüntülenen sayfalar</li>
                <li><strong>Teknik veriler:</strong> IP adresi, tarayıcı bilgisi (istatistiksel amaçlı)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Verilerin Kullanım Amacı</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hesabınızı oluşturmak ve yönetmek</li>
                <li>Platformun işleyişini ve güvenliğini sağlamak</li>
                <li>Size özel içerik ve öneriler sunmak</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Verilerin Paylaşımı</h2>
              <p>
                Kişisel verileriniz; yasal zorunluluk olmadıkça veya açık rızanız alınmadıkça üçüncü taraflarla
                paylaşılmaz. Teknik altyapı sağlayıcılarımızla (barındırma, veritabanı) yalnızca hizmet sunumu
                kapsamında ve gizlilik sözleşmesi çerçevesinde paylaşım yapılabilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Çerezler (Cookies)</h2>
              <p>
                Oturum yönetimi için zorunlu çerezler kullanılmaktadır. Analitik amaçlı çerezler için tarayıcı
                ayarlarınızdan tercihlerinizi belirleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Veri Güvenliği</h2>
              <p>
                Verileriniz SSL/TLS şifreleme ile korunmaktadır. Şifreler bcrypt algoritmasıyla hashlenerek
                saklanır; düz metin olarak tutulmaz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Veri Saklama Süresi</h2>
              <p>
                Hesap verileriniz hesabınız aktif olduğu sürece tutulur. Hesap kapatma talebinden sonra 30 gün
                içinde silinir. Yasal zorunluluklar gerektirdiğinde bu süre uzayabilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. KVKK Kapsamında Haklarınız</h2>
              <p className="mb-2">6698 sayılı Kanun&apos;un 11. maddesi uyarınca şu haklara sahipsiniz:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenme amacını ve kullanım şeklini öğrenme</li>
                <li>Yurt içi/dışına aktarıldığı tarafları öğrenme</li>
                <li>Eksik veya yanlış verilerin düzeltilmesini talep etme</li>
                <li>Verilerinizin silinmesini veya yok edilmesini talep etme</li>
                <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. İletişim</h2>
              <p>
                KVKK kapsamındaki başvurularınız için:{' '}
                <a href="mailto:kvkk@ogretmenevrak.com" className="text-blue-600 hover:underline">
                  kvkk@ogretmenevrak.com
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
