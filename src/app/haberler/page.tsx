import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haberler | KURUMSAL",
  description: "Türkiye ve dünyadan en güncel haberler — teknoloji, ekonomi, spor, sağlık ve daha fazlası.",
};

export const revalidate = 60;

const ITEMS_PER_PAGE = 20;

const CATEGORY_ICONS: Record<string, string> = {
  Teknoloji: "💻",
  Ekonomi: "📈",
  Spor: "⚽",
  Sağlık: "🏥",
  "Kültür & Sanat": "🎭",
  Dünya: "🌍",
  Gündem: "📰",
};

type PostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  viewCount: number;
  featured: boolean;
  category: { name: string; slug: string } | null;
  author: { name: string | null } | null;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
};

async function getPosts(page = 1): Promise<PostItem[]> {
  return prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        viewCount: true,
        featured: true,
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
    })
    .catch((): PostItem[] => []);
}

async function getCategories(): Promise<CategoryItem[]> {
  return prisma.category
    .findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { posts: true } },
      },
    })
    .catch((): CategoryItem[] => []);
}

async function getTotalCount() {
  return prisma.post.count({ where: { status: "PUBLISHED" } }).catch(() => 0);
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function HaberlerPage() {
  const [posts, categories, total] = await Promise.all([
    getPosts(),
    getCategories(),
    getTotalCount(),
  ]);

  const featured = posts.filter((p) => p.featured).slice(0, 1)[0] ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <MegaHeader />
      <main className="pb-12">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="py-6 border-b border-slate-700/50">
            <h1 className="text-3xl font-black text-white">Haberler</h1>
            <p className="text-slate-400 text-sm mt-1">
              {total} haber • Türkiye ve dünyadan güncel gelişmeler
            </p>
          </div>

          {/* Category filter bar */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
              <Link
                href="/haberler"
                className="flex-shrink-0 px-4 py-1.5 rounded-full bg-amber-500 text-slate-900 text-xs font-bold"
              >
                Tümü
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/haberler/${cat.slug}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 text-xs font-medium transition-colors"
                >
                  <span>{CATEGORY_ICONS[cat.name] ?? "📌"}</span>
                  {cat.name}
                  <span className="text-slate-500 ml-0.5">({cat._count.posts})</span>
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-2">
            <div className="min-w-0">
              {/* Featured */}
              {featured && (
                <div className="mb-8">
                  <Link href={`/blog/${featured.slug}`} className="group block">
                    <div className="relative aspect-[16/7] rounded-2xl overflow-hidden bg-slate-800 mb-4">
                      {featured.coverImage ? (
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 720px"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-6xl">
                          📰
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        {featured.category && (
                          <span className="inline-block mb-2 px-2.5 py-0.5 bg-amber-500 text-slate-900 text-xs font-bold rounded uppercase tracking-wide">
                            {featured.category.name}
                          </span>
                        )}
                        <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight group-hover:text-amber-300 transition-colors">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="text-slate-300 text-sm mt-2 line-clamp-2">{featured.excerpt}</p>
                        )}
                        <p className="text-slate-400 text-xs mt-3">
                          {featured.author?.name ?? "Editöryal"} •{" "}
                          {formatDate(featured.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                    Son Yazılar
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {rest.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-colors"
                      >
                        <div className="relative aspect-[16/9] bg-slate-800">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl text-slate-700">
                              {CATEGORY_ICONS[post.category?.name ?? ""] ?? "📰"}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          {post.category && (
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                              {post.category.name}
                            </span>
                          )}
                          <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors flex-1">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-slate-400 text-xs mt-2 line-clamp-2">{post.excerpt}</p>
                          )}
                          <p className="text-slate-500 text-[10px] mt-3">
                            {formatDate(post.publishedAt)} • {post.viewCount} okunma
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {posts.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <div className="text-5xl mb-3">📭</div>
                  <p>Henüz yayınlanmış haber bulunmuyor.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
