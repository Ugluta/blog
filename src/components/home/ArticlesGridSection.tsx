import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/mockData";

const catColors: Record<string, string> = {
  Teknoloji: "text-blue-400",
  Ekonomi: "text-emerald-400",
  Dünya: "text-purple-400",
  Spor: "text-red-400",
  Sağlık: "text-cyan-400",
  Kültür: "text-amber-400",
};

const catBgColors: Record<string, string> = {
  Teknoloji: "bg-blue-400/10",
  Ekonomi: "bg-emerald-400/10",
  Dünya: "bg-purple-400/10",
  Spor: "bg-red-400/10",
  Sağlık: "bg-cyan-400/10",
  Kültür: "bg-amber-400/10",
};

export default function ArticlesGridSection() {
  return (
    <section className="py-12" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-white">Makaleler</h2>
          </div>
          <Link href="/blog" className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1">
            Tümü <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {blogPosts.slice(0, 8).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block overflow-hidden rounded-xl border border-slate-700/30 hover:border-amber-500/30 transition-colors shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-amber-500/5"
              style={{ backgroundColor: "#0F172A" }}
            >
              <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-3">
                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${catColors[post.category] ?? "text-amber-400"} ${catBgColors[post.category] ?? "bg-amber-400/10"}`}>
                  {post.category}
                </span>
                <h3 className="text-sm font-bold leading-snug text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 mt-1">
                  {post.title}
                </h3>
                <span className="text-[10px] text-slate-500 mt-2 block">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
