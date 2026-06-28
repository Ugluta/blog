import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight, Code2, FolderGit2, Image as ImageIcon, Briefcase,
  Newspaper, Sparkles, Mail, ArrowUpRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Renkli “build-art” gradient paleti — kartlara çeşitlilik katar
const ART = [
  'from-fuchsia-500 via-purple-500 to-indigo-600',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-blue-500 via-indigo-500 to-violet-600',
  'from-pink-500 via-rose-500 to-orange-400',
  'from-cyan-400 via-sky-500 to-blue-600',
];

const pillars = [
  { title: 'Projeler', desc: 'Üzerinde çalıştığım ürün ve uygulamaları keşfet.', href: '/projeler', Icon: FolderGit2, art: ART[3] },
  { title: 'Blog', desc: 'Yazılar, notlar ve teknik içerikler.', href: '/haberler', Icon: Newspaper, art: ART[0] },
  { title: 'Kod', desc: 'Kod parçaları, ipuçları ve çözümler.', href: '/kod', Icon: Code2, art: ART[2] },
];

const more = [
  { title: 'Galeri', desc: 'Görseller ve tasarımlar', href: '/galeri', Icon: ImageIcon, color: 'text-pink-600 bg-pink-50' },
  { title: 'Hizmetler', desc: 'Sunduğum ürün ve hizmetler', href: '/hizmetler', Icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
  { title: 'İletişim', desc: 'İşbirliği için bana ulaş', href: '/iletisim', Icon: Mail, color: 'text-blue-600 bg-blue-50' },
];

function ArtThumb({ art, label }: { art: string; label: string }) {
  return (
    <div className={`relative aspect-[16/9] bg-gradient-to-br ${art} overflow-hidden`}>
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="absolute bottom-3 left-4">
        <span className="font-mono text-white/90 text-lg font-bold tracking-tight drop-shadow">{label}</span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  let posts: { id: string; title: string; slug: string; excerpt: string | null; image: string | null; category: string | null; createdAt: Date }[] = [];
  try {
    posts = await db.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      select: { id: true, title: true, slug: true, excerpt: true, image: true, category: true, createdAt: true },
    });
  } catch { posts = []; }

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.35),transparent)]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-24 md:py-32">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> İçerik üret, paylaş, dağıt
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl">
              Fikirler, projeler ve{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">kod tek yerde</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10">
              Blog yazıları, projeler, kod paylaşımları, galeri ve hizmetler — hepsi bu platformda bir araya geliyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/haberler" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                Yazıları Oku <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/projeler" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Projeleri Gör
              </Link>
            </div>
          </div>
        </section>

        {/* PILLARS — büyük renkli kartlar (MS Build tarzı) */}
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Öne Çıkanlar</h2>
          <p className="text-gray-500 mb-8">Başlamak için bir başlık seç</p>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map(({ title, desc, href, Icon, art }) => (
              <Link key={title} href={href}
                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <ArtThumb art={art} label={`</${title.toLowerCase()}>`} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                    Keşfet <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* LATEST POSTS */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Son Yazılar</h2>
                <p className="text-gray-500 mt-1">Bloga eklenen güncel içerikler</p>
              </div>
              <Link href="/haberler" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all">
                Tümü <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <Link key={post.id} href={`/haberler/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                    ) : (
                      <ArtThumb art={ART[i % ART.length]} label={post.category ?? 'blog'} />
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-blue-600 mb-2">{post.category}</span>
                      )}
                      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>}
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 mt-4 group-hover:gap-2.5 transition-all">
                        Devamını oku <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz yazı yok. Admin panelinden içerik ekleyebilirsin.</p>
              </div>
            )}
          </div>
        </section>

        {/* MORE SECTIONS */}
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Daha Fazlası</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {more.map(({ title, desc, href, Icon, color }) => (
              <Link key={title} href={href}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1">{title} <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" /></h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(139,92,246,0.3),transparent)]" />
          <div className="relative max-w-3xl mx-auto px-5 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">İşbirliği mi düşünüyorsun?</h2>
            <p className="text-slate-400 mb-8 text-lg">Projeler, hizmetler veya içerik üretimi için bana ulaş.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/iletisim" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                <Mail className="w-4 h-4" /> İletişime Geç
              </Link>
              <Link href="/hizmetler" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                <Briefcase className="w-4 h-4" /> Hizmetler
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
