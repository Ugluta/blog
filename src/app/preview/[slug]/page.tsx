import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Taslak",
  REVIEW: "İnceleme Bekliyor",
  ARCHIVED: "Arşiv",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  REVIEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ARCHIVED: "bg-slate-600/30 text-slate-400 border-slate-600/30",
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function PreviewPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "PUBLISHER"];
  const userRole = session.user.role as string;

  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { name: true, slug: true } },
    },
  }).catch(() => null);

  if (!post) notFound();

  const isAuthor = post.authorId === session.user.id;
  const isPrivileged = allowedRoles.includes(userRole);

  if (!isAuthor && !isPrivileged) {
    return (
      <>
        <MegaHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-3xl mb-4">🔒</p>
          <h1 className="text-xl font-bold text-white mb-2">Erişim Reddedildi</h1>
          <p className="text-slate-400 mb-6">Bu taslağı görüntüleme yetkiniz yok.</p>
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm">Ana Sayfaya Dön</Link>
        </div>
        <Footer />
      </>
    );
  }

  if (post.status === "PUBLISHED") {
    redirect(`/blog/${slug}`);
  }

  return (
    <>
      <MegaHeader />
      <main className="pb-12">
        {/* Preview banner */}
        <div className="bg-slate-800/80 border-b border-slate-700/50 sticky top-0 z-40 backdrop-blur">
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLOR[post.status] ?? "bg-slate-700 text-slate-400 border-slate-600"}`}>
                {STATUS_LABEL[post.status] ?? post.status}
              </span>
              <span className="text-xs text-slate-500">Önizleme modu — bu sayfa halka açık değil</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/uygulama/yazilar/${post.id}`}
                className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                ✏️ Düzenle
              </Link>
              {isPrivileged && (
                <Link
                  href="/admin/posts"
                  className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Admin Paneli
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto py-8">
            {/* Category */}
            {post.category && (
              <span className="inline-block mb-3 px-2.5 py-0.5 bg-amber-500 text-slate-900 text-xs font-bold rounded uppercase tracking-wide">
                {post.category.name}
              </span>
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
            <div className="flex items-center gap-4 py-4 border-y border-slate-700/50 mb-6">
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
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                  {post.author?.name?.[0] ?? "E"}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-200">{post.author?.name ?? "Editöryal Ekip"}</p>
                <p className="text-xs text-slate-500">
                  Oluşturuldu: {formatDate(post.createdAt)} · Güncellendi: {formatDate(post.updatedAt)}
                </p>
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
                  sizes="(max-width: 768px) 100vw, 768px"
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
              <div className="mt-8 pt-5 border-t border-slate-700/50">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Etiketler</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
