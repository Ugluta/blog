import { db } from '@/lib/db'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Check, Crown, Zap, CreditCard } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Üyelik Paketleri',
  description: 'Öğretmen Evrak premium üyelik planları ve fiyatları.',
}

export default async function UyelikPage() {
  const plans = await db.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-b from-blue-50 to-white">
          <div className="container-custom py-16 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Üyelik Paketleri</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Öğretmen Evrak’ı daha verimli kullanmak için size en uygun paketi seçin.
            </p>
          </div>
        </div>

        <div className="container-custom py-12">
          {plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl border flex flex-col ${
                    plan.isFeatured
                      ? 'border-blue-400 shadow-xl shadow-blue-100 md:-translate-y-2'
                      : 'border-gray-200 shadow-sm'
                  }`}
                >
                  {plan.isFeatured && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                        <Crown className="w-3.5 h-3.5" /> En Popüler
                      </span>
                    </div>
                  )}

                  <div className={`p-6 border-b ${
                    plan.isFeatured ? 'border-blue-100 bg-blue-50/40' : 'border-gray-100'
                  }`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                    {plan.description && (
                      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                    )}
                    <div>
                      {plan.price === 0 ? (
                        <span className="text-4xl font-extrabold text-gray-900">Ücretsız</span>
                      ) : (
                        <>
                          <span className="text-4xl font-extrabold text-gray-900">{plan.price}₺</span>
                          <span className="text-gray-400 text-sm">/ay</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1 mb-6">
                      {(plan.features as string[]).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {plan.price === 0 ? (
                      <Link
                        href="/kayit"
                        className="block text-center py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Ücretsız Başla
                      </Link>
                    ) : (
                      <a
                        href={`mailto:info@ogretmenevrak.com?subject=${encodeURIComponent(plan.name + ' paketi hakkında bilgi almak istiyorum')}`}
                        className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                          plan.isFeatured
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4" /> Şimdi Yükselt
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>Üyelik paketleri yakında eklenecek.</p>
            </div>
          )}

          <div className="text-center mt-12 p-6 bg-white rounded-2xl border border-gray-100 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Kurumsal Paket</h3>
            <p className="text-sm text-gray-500 mb-4">
              Okul veya ilce düzeyinde toplu üyelik için özel fiyatlandırma sunuyoruz.
            </p>
            <a
              href="mailto:info@ogretmenevrak.com?subject=Kurumsal+paket+bilgi"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-medium text-sm rounded-xl hover:bg-blue-100 transition-colors"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
