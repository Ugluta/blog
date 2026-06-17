import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/mockData";

const categoryColors: Record<string, string> = {
  Teknoloji: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Ekonomi: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  Dünya: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Spor: "bg-red-500/20 text-red-400 border border-red-500/30",
  Sağlık: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  Kültür: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
};

function BlogCard({ post }: { post: (typeof blogPosts)[0] }) {
  const catCls = categoryColors[post.category] ?? "bg-slate-700 text-slate-400";

  return (
    <Link href={`/blog/${post.id}`} className="group block bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 news-card-hover">
      {/* Image */}
      <div className="relative w-full img-zoom-container bg-slate-700" style={{ paddingBottom: "56.25%" }}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        {/* Category Badge on image */}
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${catCls}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold leading-snug text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {post.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3 font-inter">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] bg-slate-700 text-slate-400 rounded font-mono">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author + Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-inter truncate max-w-[80px]">
              {post.author}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-inter">
            <span>{post.date.split(" ").slice(0, 2).join(" ")}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime} dk
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogSection() {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold section-header" style={{ fontFamily: "'Playfair Display', serif" }}>
          Son Blog Yazıları
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-900 rounded-lg transition-opacity hover:opacity-90 font-inter"
          style={{ backgroundColor: "#F59E0B" }}
        >
          Tüm Yazılar
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
