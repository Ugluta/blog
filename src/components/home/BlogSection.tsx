import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/mockData";

const categoryClass: Record<string, string> = {
  Teknoloji: "bg-blue-500/20 text-blue-400",
  Ekonomi: "bg-emerald-500/20 text-emerald-400",
  Dünya: "bg-purple-500/20 text-purple-400",
  Spor: "bg-red-500/20 text-red-400",
  Sağlık: "bg-cyan-500/20 text-cyan-400",
  Kültür: "bg-amber-500/20 text-amber-400",
};

function BlogCard({ post }: { post: (typeof blogPosts)[0] }) {
  const catCls = categoryClass[post.category] ?? "bg-slate-700/50 text-slate-400";

  return (
    <Link
      href={`/blog/${post.id}`}
      className="group block border border-slate-700/30 hover:border-amber-500/30 transition-colors overflow-hidden"
      style={{ backgroundColor: "#0F172A", borderRadius: "2px" }}
    >
      {/* Image top 16:9 */}
      <div
        className="relative w-full img-zoom-container bg-slate-800"
        style={{ paddingBottom: "56.25%" }}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Category badge on image */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase ${catCls}`}
            style={{ borderRadius: "1px" }}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="text-sm font-bold leading-snug text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {post.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Author + meta footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(51,65,85,0.5)" }}
        >
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 overflow-hidden bg-slate-700 flex-shrink-0" style={{ borderRadius: "50%" }}>
              <Image
                src={post.authorAvatar}
                alt={post.author}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-[11px] text-slate-400 truncate max-w-[80px]">
              {post.author}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span>{post.date.split(" ").slice(0, 2).join(" ")}</span>
            <span className="text-slate-700">·</span>
            <span>{post.readTime} dk</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogSection() {
  return (
    <section className="py-10" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section title with left amber border */}
        <div className="flex items-center justify-between mb-8">
          <div style={{ borderLeft: "3px solid #F59E0B", paddingLeft: "0.75rem" }}>
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Tüm Yazılar →
          </Link>
        </div>

        {/* 4-col desktop, 2-col tablet, 1-col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {blogPosts.slice(0, 8).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
