import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FolderGit2, ExternalLink, Github } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Projeler' };

type Project = {
  title: string;
  desc: string;
  tags: string[];
  url?: string;
  repo?: string;
};

const projects: Project[] = [];

export default function ProjelerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Projeler</h1>
            <p className="text-gray-500 mt-2">Üzerinde çalıştığım ürün ve uygulamalar.</p>
          </div>

          {projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <div key={p.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                    <FolderGit2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Site</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"><Github className="w-3.5 h-3.5" /> Kod</a>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <FolderGit2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz proje eklenmedi. Yakında burada olacak.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
