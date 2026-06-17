import Link from "next/link";
import Image from "next/image";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | KURUMSAL",
  description: "Teknoloji, ekonomi, girişimcilik ve daha fazlası hakkında derinlemesine analizler ve görüşler.",
};

export const revalidate = 60;

type PostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  viewCount: number;
  tags: string[];
  category: { name: string; slug: string } | null;
  author: { name: string | null } | null;
};

async function getPosts(): Promise<PostItem[]> {
  return prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        viewCount: true,
        tags: true,
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
    })
    .catch((): PostItem[] => []);
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

const CAT_COLORS: Record<string, string> = {
  Teknoloji: "bg-blue-500/20 text-blue-400",
  Ekonomi: "bg-emerald-500/20 text-emerald-400",
  Dünya: "bg-purple-500/20 text-purple-400",
  Spor: "bg-red-500/20 text-red-400",
  Sağlık: "bg-cyan-500/20 text-cyan-400",
  Kültür: "bg-amber-500/20 text-amber-400",
};

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <MegaHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-300">Blog</span>
        </nav>

        <div className="flex gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Blog
              </h1>
              <span className="text-xs text-slate-500">{posts.length} yazı</span>
            </div>

            {posts.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Featured */}
                {featured && (
                  <Link href={`/haber/${featured.slug}`} className="group block mb-8">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 transition-all">
                      {featured.coverImage ? (
                        <div className="relative h-64 sm:h-80">
                          <Image
                            src={featured.coverImage}
                            alt={featured.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-amber-500/20 to-blue-500/20" />
                      )}
                      <div className={`${featured.coverImage ? "absolute bottom-0 left-0 right-0" : ""} p-6`}>
                        {featured.category && (
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded mb-3 ${CAT_COLORS[featured.category.name] ?? "bg-slate-700 text-slate-400"}`}>
                            {featured.category.name}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="text-sm text-slate-300 line-clamp-2">{featured.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                          {featured.author?.name && <span>{featured.author.name}</span>}
                          <span>·</span>
                          <span>{formatDate(featured.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rest.map((post: PostItem) => (
                    <Link key={post.id} href={`/haber/${post.slug}`} className="group block bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/30 transition-all">
                      {post.coverImage && (
                        <div className="relative h-44">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="400px" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          {post.category && (
                            <div className="absolute top-3 left-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${CAT_COLORS[post.category.name] ?? "bg-slate-700 text-slate-400"}`}>
                                {post.category.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 mb-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{post.excerpt}</p>
                        )}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-slate-700 text-slate-400 rounded font-mono">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 text-[11px] text-slate-500">
                          <span>{post.author?.name ?? "Anonim"}</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 text-slate-500">
      <div className="text-5xl mb-4">✍️</div>
      <p className="text-sm">Henüz yayımlanmış blog yazısı yok.</p>
    </div>
  );
}
