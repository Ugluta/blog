import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import type { Metadata } from "next";

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

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const cat = await prisma.category
    .findUnique({ where: { slug: categorySlug } })
    .catch(() => null);
  if (!cat) return { title: "Kategori Bulunamadı" };
  return {
    title: `${cat.name} Haberleri | KURUMSAL`,
    description: cat.description ?? `${cat.name} alanındaki en güncel haberler ve analizler.`,
  };
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function CategoryHaberlerPage({ params }: Props) {
  const { categorySlug } = await params;

  const cat = await prisma.category
    .findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    })
    .catch(() => null);

  if (!cat) notFound();

  // include self + children slugs
  const categoryIds: string[] = [cat.id, ...cat.children.map((c: { id: string }) => c.id)];

  const posts: PostItem[] = await prisma.post
    .findMany({
      where: { status: "PUBLISHED", categoryId: { in: categoryIds } },
      orderBy: { publishedAt: "desc" },
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

  const total: number = await prisma.post
    .count({ where: { status: "PUBLISHED", categoryId: { in: categoryIds } } })
    .catch(() => 0);

  const featured: PostItem | undefined = posts.find((p: PostItem) => p.featured) ?? posts[0];
  const rest: PostItem[] = posts.filter((p: PostItem) => p.id !== featured?.id);

  return (
    <>
      <MegaHeader />
      <main className="pb-12">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Link href="/haberler" className="hover:text-amber-400 transition-colors">
                Haberler
              </Link>
              <span>/</span>
              <span className="text-slate-300">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{CATEGORY_ICONS[cat.name] ?? "📌"}</span>
              <div>
                <h1 className="text-3xl font-black text-white">{cat.name}</h1>
                {cat.description && (
                  <p className="text-slate-400 text-sm mt-0.5">{cat.description}</p>
                )}
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-2">{total} haber</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-6">
            <div className="min-w-0">
              {featured && (
                <div className="mb-8">
                  <Link href={`/haber/${featured.slug}`} className="group block">
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
                          {CATEGORY_ICONS[cat.name] ?? "📰"}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight group-hover:text-amber-300 transition-colors">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="text-slate-300 text-sm mt-2 line-clamp-2">{featured.excerpt}</p>
                        )}
                        <p className="text-slate-400 text-xs mt-3">
                          {featured.author?.name ?? "Editöryal"} • {formatDate(featured.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {rest.map((post: PostItem) => (
                    <Link
                      key={post.id}
                      href={`/haber/${post.slug}`}
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
                        {post.category && post.category.slug !== categorySlug && (
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
              )}

              {posts.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <div className="text-5xl mb-3">📭</div>
                  <p>Bu kategoride henüz haber bulunmuyor.</p>
                  <Link href="/haberler" className="mt-3 inline-block text-amber-400 text-sm hover:text-amber-300">
                    Tüm haberler →
                  </Link>
                </div>
              )}
            </div>

            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
