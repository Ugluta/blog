import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { BookOpen, Users, Target, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkımızda — ÖğretmenEvrak',
  description: 'ÖğretmenEvrak hakkında bilgi edinin. Misyonumuz, vizyonumuz ve ekibimiz.',
}

const values = [
  {
    icon: Target,
    title: 'Misyonumuz',
    text: 'Türkiye genelindeki öğretmen ve okul idarecilerinin evrak, materyal ve kaynak ihtiyaçlarını tek platformda karşılamak; bürokrasiyi azaltarak eğitime daha fazla zaman ayırmalarını sağlamak.',
  },
  {
    icon: BookOpen,
    title: 'Vizyonumuz',
    text: 'Eğitim camiasının en güvenilir dijital platformu olmak; öğretmenler arasında bilgi ve materyal paylaşım kültürünü yaygınlaştırmak.',
  },
  {
    icon: Users,
    title: 'Topluluğumuz',
    text: 'Türkiye\'nin dört bir yanından binlerce öğretmen, okul yöneticisi ve eğitim çalışanı ÖğretmenEvrak\'ta bir araya geliyor. Her gün yeni materyaller paylaşılıyor, deneyimler aktarılıyor.',
  },
  {
    icon: Zap,
    title: 'Teknolojimiz',
    text: 'Yapay zeka destekli belge oluşturma, OCR ile görüntüden metin çıkarma ve anlık PDF üretimi gibi özelliklerle öğretmenlerin işini kolaylaştırıyoruz.',
  },
]

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="border-b border-gray-100 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-5">
              <BookOpen className="w-4 h-4" /> ÖğretmenEvrak
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Öğretmenler için,<br />öğretmenlerle birlikte
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              2024 yılında kurulan ÖğretmenEvrak; okul evraklarını, ders materyallerini ve eğitim kaynaklarını
              tek çatı altında toplayan bir platform olarak yola çıktı.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
                  <p className="text-gray-500 text-[15px] leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Kayıtlı Üye', value: '10.000+' },
              { label: 'Paylaşılan Materyal', value: '50.000+' },
              { label: 'Oluşturulan Evrak', value: '200.000+' },
              { label: 'İl', value: '81' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-blue-600 mb-1">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Topluluğumuza katılın</h2>
            <p className="text-gray-500 mb-6">Binlerce öğretmenle birlikte deneyimlerinizi paylaşın, kaynaklara erişin.</p>
            <a
              href="/kayit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Ücretsiz Üye Ol
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
