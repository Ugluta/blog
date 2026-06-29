import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/public/PageHero';
import Link from 'next/link';
import { Briefcase, Check, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Hizmetler' };
export const dynamic = 'force-dynamic';

export default async function HizmetlerPage() {
  let services: { id: string; title: string; description: string; features: string[]; price: string | null }[] = [];
  try {
    services = await db.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch { services = []; }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <PageHero eyebrow="Hizmetler" title="Ürün & Hizmetler" subtitle="Sunduğum ürün ve hizmetler." />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          {services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                  {s.price && <p className="text-blue-600 font-bold mt-1">{s.price}</p>}
                  <p className="text-sm text-gray-500 mt-2">{s.description}</p>
                  <ul className="space-y-2 mt-4 flex-1">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/iletisim" className="inline-flex items-center justify-center gap-1.5 mt-5 h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors">
                    Teklif Al <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz hizmet eklenmedi. İşbirliği için <Link href="/iletisim" className="text-blue-600 hover:underline">iletişime geç</Link>.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
