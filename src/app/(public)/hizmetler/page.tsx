import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Briefcase, Check, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Hizmetler' };

type Service = { title: string; desc: string; features: string[] };
const services: Service[] = [];

export default function HizmetlerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Hizmetler</h1>
            <p className="text-gray-500 mt-2">Sunduğum ürün ve hizmetler.</p>
          </div>

          {services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{s.desc}</p>
                  <ul className="space-y-2 mt-4 flex-1">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/iletisim" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 mt-5 hover:gap-2 transition-all">
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
