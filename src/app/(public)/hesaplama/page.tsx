import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HesaplamaClient } from './HesaplamaClient';
import { Calculator } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maliyet & Kâr Hesaplama',
  description: 'E-ticaret kar hesaplama aracı: komisyon, kargo ve ekstra maliyetlerle net kârı veya hedef kâr için gereken satış fiyatını hesaplayın.',
};

export default function HesaplamaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-8 md:py-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Maliyet & Kâr Hesaplama</h1>
              <p className="text-sm text-gray-500">Komisyon, kargo ve ekstra maliyetlerle net kârı veya hedef kâr için gereken satış fiyatını anında hesapla.</p>
            </div>
          </div>
          <HesaplamaClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
