import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/public/PageHero';
import { ArtThumb } from '@/components/public/ArtThumb';
import { FolderGit2, ExternalLink, Github } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Projeler' };
export const dynamic = 'force-dynamic';

export default async function ProjelerPage() {
  let projects: { id: string; title: string; description: string; coverImage: string | null; tags: string[]; liveUrl: string | null; repoUrl: string | null }[] = [];
  try {
    projects = await db.project.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch { projects = []; }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <PageHero eyebrow="Portföy" title="Projeler" subtitle="Üzerinde çalıştığım ürün ve uygulamalar." />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          {projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <div key={p.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  {p.coverImage
                    ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt={p.title} className="w-full aspect-[16/9] object-cover" />
                    )
                    : <ArtThumb i={i} label={`</${p.title.toLowerCase().slice(0, 10)}>`} />}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderGit2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-gray-900">{p.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-3">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.tags.map((t) => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                    {(p.liveUrl || p.repoUrl) && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Canlı Site</a>}
                        {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:underline"><Github className="w-3.5 h-3.5" /> Kod</a>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <FolderGit2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz proje eklenmedi.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
