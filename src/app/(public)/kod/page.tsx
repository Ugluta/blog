import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-14">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Kod Paylaşımları</h1>
            <p className="text-gray-500 mt-2">Kod parçaları, ipuçları ve çözümler.</p>
          </div>

          {snippets.length > 0 ? (
            <div className="space-y-6">
              {snippets.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-violet-600" />
                      <h3 className="font-bold text-gray-900">{s.title}</h3>
                    </div>
                    <span className="text-xs font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-500 px-5 pt-3">{s.description}</p>}
                  <pre className="text-sm bg-slate-950 text-slate-100 p-5 overflow-x-auto m-4 rounded-xl"><code>{s.code}</code></pre>
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
