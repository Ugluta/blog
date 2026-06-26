import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight, Code2, FolderGit2, Image as ImageIcon, Briefcase,
  Newspaper, Sparkles, Github, Mail,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const sections = [
  { title: 'Blog', desc: 'Güncel yazılar, notlar ve düşünceler', href: '/haberler', Icon: Newspaper, color: 'from-blue-500 to-blue-600' },
  { title: 'Projeler', desc: 'Üzerinde çalıştığım ürün ve uygulamalar', href: '/projeler', Icon: FolderGit2, color: 'from-emerald-500 to-emerald-600' },
  { title: 'Kod', desc: 'Kod parçaları, ipuçları ve çözümler', href: '/kod', Icon: Code2, color: 'from-violet-500 to-violet-600' },
  { title: 'Galeri', desc: 'Görseller, tasarımlar ve çalışmalar', href: '/galeri', Icon: ImageIcon, color: 'from-pink-500 to-rose-600' },
  { title: 'Hizmetler', desc: 'Sunduğum ürün ve hizmetler', href: '/hizmetler', Icon: Briefcase, color: 'from-amber-500 to-orange-600' },
];

export default async function HomePage() {
  let posts: { id: string; title: string; slug: string; excerpt: string | null; image: string | null; createdAt: Date }[] = [];
  try {
    posts = await db.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      select: { id: true, title: true, slug: true, excerpt: true, image: true, createdAt: true },
    });
  } catch {
    posts = [];
  }

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.25),transparent)]" />
          <div className="relative max-w-5xl mx-auto px-5 lg:px-8 py-24 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              İçerik üret, paylaş, dağıt
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">
              Fikirler, projeler ve<br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                kod tek yerde
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Blog yazıları, projeler, kod paylaşımları, galeri ve hizmetler.
              Hepsi bu platformda bir araya geliyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/haberler"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                Yazıları Oku <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/projeler"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Projeleri Gör
              </Link>
            </div>
          </div>
        </section>

        {/* SECTIONS GRID */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keşfet</h2>
            <p className="text-gray-500 mb-8">Bölümlere göz at</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {sections.map(({ title, desc, href, Icon, color }) => (
                <Link key={title} href={href}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-snug">{desc}</p>
                  <ArrowRight className="w-4 h-4 text-gray-300 mt-4 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST POSTS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Son Yazılar</h2>
                <p className="text-gray-500 mt-1">Bloga eklenen son içerikler</p>
              </div>
              <Link href="/haberler" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:gap-2 transition-all">
                Tümü <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <Link key={post.id} href={`/haberler/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Newspaper className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>}
                      <p className="text-xs text-gray-400 mt-3">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz yazı yok. Admin panelinden içerik ekleyebilir veya scraper çalıştırabilirsin.</p>
                <Link href="/admin/icerik" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 mt-4 hover:gap-2 transition-all">
                  İçerik Yönetimi <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-slate-950 text-white">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-3xl font-bold mb-4">İşbirliği mi düşünüyorsun?</h2>
            <p className="text-slate-400 mb-8">Projeler, hizmetler veya içerik üretimi için bana ulaş.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/iletisim"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                <Mail className="w-4 h-4" /> İletişime Geç
              </Link>
              <Link href="/hizmetler"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
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
