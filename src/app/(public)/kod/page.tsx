import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/public/PageHero';
import { Code2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kod Paylaşımları' };
export const dynamic = 'force-dynamic';

export default async function KodPage() {
  let snippets: { id: string; title: string; description: string | null; language: string; code: string; tags: string[] }[] = [];
  try {
    snippets = await db.codeSnippet.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch { snippets = []; }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <PageHero eyebrow="Portföy" title="Kod Paylaşımları" subtitle="Kod parçaları, ipuçları ve çözümler." />

        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12">
          {snippets.length > 0 ? (
            <div className="space-y-6">
              {snippets.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <Code2 className="w-4 h-4 text-violet-600 shrink-0" />
                      <h3 className="font-bold text-gray-900 truncate">{s.title}</h3>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full shrink-0">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-500 px-5 pt-3.5">{s.description}</p>}
                  <div className="p-4">
                    <pre className="text-sm bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto"><code>{s.code}</code></pre>
                  </div>
                  {s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-5 pb-5">
                      {s.tags.map((t) => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <Code2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz kod paylaşımı yok.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
