import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/public/PageHero';
import { HesaplamaClient } from './HesaplamaClient';
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
        <PageHero eyebrow="Araç" title="Maliyet & Kâr Hesaplama" subtitle="Komisyon, kargo ve ekstra maliyetlerle net kârını veya hedef kâr için gereken satış fiyatını anında hesapla." />
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12">
          <HesaplamaClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
