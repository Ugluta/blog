import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArtThumb } from '@/components/public/ArtThumb';
import { ExternalLink, Github, ChevronRight, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await db.project.findUnique({ where: { slug }, select: { title: true, description: true, coverImage: true } });
  if (!p) return { title: 'Proje Bulunamadı' };
  return {
    title: p.title,
    description: p.description,
    openGraph: { title: p.title, description: p.description, images: p.coverImage ? [p.coverImage] : [] },
  };
}

export default async function ProjeDetayPage({ params }: Props) {
  const { slug } = await params;
  const p = await db.project.findUnique({ where: { slug } });
  if (!p || !p.isActive) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-5 lg:px-8 py-4">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/projeler" className="hover:text-blue-600">Projeler</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-800 truncate max-w-[220px]">{p.title}</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-5 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {p.coverImage
              ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt={p.title} className="w-full h-64 md:h-80 object-cover" />
              )
              : <ArtThumb i={0} label={`</${p.title.toLowerCase().slice(0, 12)}>`} className="h-64 md:h-80" />}
            <div className="p-6 md:p-9">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{p.title}</h1>
              <p className="text-lg text-gray-600 mb-5">{p.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.tags.map((t) => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{t}</span>)}
              </div>

              {(p.liveUrl || p.repoUrl) && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"><ExternalLink className="w-4 h-4" /> Canlı Site</a>}
                  {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl"><Github className="w-4 h-4" /> Kod Deposu</a>}
                </div>
              )}

              {p.content && <div className="article-content border-t border-gray-100 pt-6" dangerouslySetInnerHTML={{ __html: p.content }} />}
            </div>
          </div>

          <div className="mt-6">
            <Link href="/projeler" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:gap-2.5 transition-all"><ArrowLeft className="w-4 h-4" /> Tüm Projeler</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
