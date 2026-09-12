import Image from "next/image";
import Link from "next/link";
import { recentPosts, mostCommentedPosts } from "@/lib/mockData";

const catColors: Record<string, string> = {
  Teknoloji: "text-blue-400",
  Ekonomi: "text-emerald-400",
  Dünya: "text-purple-400",
  Spor: "text-red-400",
  Sağlık: "text-cyan-400",
  Kültür: "text-amber-400",
};

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/50">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex-shrink-0" />
        <h3 className="text-sm font-black uppercase tracking-wider text-white">{title}</h3>
      </div>
      <Link href={href} className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors font-medium">
        Tümü →
      </Link>
    </div>
  );
}

export default function TrendingSection() {
  return (
    <section className="py-12" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <SectionHeader title="Son Yazılar" href="/blog" />
            <div className="space-y-4">
              {recentPosts.slice(0, 5).map((post, i) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group flex items-center gap-3">
                  <span className="text-2xl font-black text-slate-800 flex-shrink-0 w-7 tabular-nums">{i + 1}</span>
                  <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-slate-800 rounded-lg">
                    <Image src={post.image} alt={post.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-bold uppercase ${catColors[post.category] ?? "text-amber-400"}`}>{post.category}</span>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <span className="text-[10px] text-slate-500">{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="En Çok Okunan" href="/blog" />
            <div className="space-y-4">
              {mostCommentedPosts.slice(0, 5).map((post, i) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group flex items-start gap-3">
                  <span className="text-2xl font-black text-slate-800 flex-shrink-0 w-7 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-bold uppercase ${catColors[post.category] ?? "text-amber-400"}`}>{post.category}</span>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mt-0.5">
                      {post.title}
                    </p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {post.commentCount} yorum
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Öne Çıkanlar" href="/blog" />
            <div className="space-y-4">
              {recentPosts.slice(0, 5).map((post, i) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group flex items-center gap-3">
                  <span className="text-2xl font-black text-slate-800 flex-shrink-0 w-7 tabular-nums">{i + 1}</span>
                  <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-slate-800 rounded-lg">
                    <Image src={`https://picsum.photos/56/56?random=${post.id + 90}`} alt={post.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-bold uppercase ${catColors[post.category] ?? "text-amber-400"}`}>{post.category}</span>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <span className="text-[10px] text-slate-500">{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
