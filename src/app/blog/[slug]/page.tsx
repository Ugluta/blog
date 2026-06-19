import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import CommentSection from "@/components/comments/CommentSection";
import type { Metadata } from "next";

export const revalidate = 60;

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  publishedAt: Date | null;
  excerpt: string | null;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post
    .findUnique({
      where: { slug },
      select: { title: true, metaTitle: true, metaDescription: true, excerpt: true, coverImage: true },
    })
    .catch(() => null);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.metaTitle ?? `${post.title} | Kurumsal`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post
    .findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
      },
    })
    .catch(() => null);

  if (!post) notFound();

  prisma.post
    .update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const related = post.categoryId
    ? await prisma.post
        .findMany({
          where: {
            status: "PUBLISHED",
            categoryId: post.categoryId,
            id: { not: post.id },
          },
          take: 4,
          orderBy: { publishedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            publishedAt: true,
            excerpt: true,
          },
        })
        .catch((): RelatedPost[] => [])
    : ([] as RelatedPost[]);

  return (
    <>
      <MegaHeader />
      <main className="pb-12" style={{ backgroundColor: "#0a0f1e" }}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-8">

            {/* ── Article ── */}
            <article className="min-w-0">

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
                <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
                <span className="text-slate-700">/</span>
                <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
                {post.category && (
                  <>
                    <span className="text-slate-700">/</span>
                    <Link
                      href="/blog"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
              </div>

              {/* Category badge */}
              {post.category && (
                <Link
                  href="/blog"
                  className="inline-block mb-3 px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wide hover:bg-amber-500/25 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-slate-300 text-lg leading-relaxed mb-5 border-l-4 border-amber-500 pl-4">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 py-4 border-y border-slate-700/40 mb-6">
                {post.author?.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name ?? "Yazar"}
                    width={36}
                    height={36}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                    {post.author?.name?.[0] ?? "Y"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-200">{post.author?.name ?? "Editöryal Ekip"}</p>
                  <p className="text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-slate-500 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.viewCount} okunma
                </div>
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-800 mb-8">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 720px"
                    priority
                    unoptimized
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-black prose-headings:text-white
                  prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
                  prose-strong:text-white
                  prose-blockquote:border-amber-500 prose-blockquote:text-slate-300
                  prose-code:text-amber-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-hr:border-slate-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-5 border-t border-slate-700/40">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Etiketler</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-800 border border-slate-700/60 text-slate-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <CommentSection slug={slug} postTitle={post.title} />

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                    Benzer Yazılar
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((r: RelatedPost) => (
                      <Link
                        key={r.id}
                        href={`/blog/${r.slug}`}
                        className="group flex gap-3 rounded-xl border border-slate-700/40 hover:border-amber-500/30 p-3 transition-colors"
                        style={{ backgroundColor: "#0F172A" }}
                      >
                        {r.coverImage && (
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                            <Image
                              src={r.coverImage}
                              alt={r.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold text-slate-200 line-clamp-2 group-hover:text-amber-300 transition-colors leading-snug">
                            {r.title}
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-1">{formatDate(r.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
