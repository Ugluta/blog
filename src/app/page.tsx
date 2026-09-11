import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.contentItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { category: true },
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sax">ikie</h1>
        <a href="/admin/login" className="text-sm text-ink/60 hover:text-sax">
          Yönetim
        </a>
      </header>

      {posts.length === 0 ? (
        <p className="text-ink/60">Henüz yayınlanmış içerik yok.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-ink/10 pb-8">
              <p className="text-xs uppercase tracking-wide text-sax mb-1">
                {post.category?.name ?? "Genel"}
              </p>
              <h2 className="text-xl font-semibold mb-2">{post.aiTitle}</h2>
              <p className="text-ink/70 line-clamp-3">
                {(post.aiContent ?? "").slice(0, 220)}…
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
