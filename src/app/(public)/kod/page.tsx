import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Code2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kod Paylaşımları' };

type Snippet = { title: string; lang: string; desc: string };
const snippets: Snippet[] = [];

export default function KodPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Kod Paylaşımları</h1>
            <p className="text-gray-500 mt-2">Kod parçaları, ipuçları ve çözümler.</p>
          </div>

          {snippets.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {snippets.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-violet-600" />
                    <span className="text-xs font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded">{s.lang}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <Code2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz kod paylaşımı yok. Yakında burada olacak.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
