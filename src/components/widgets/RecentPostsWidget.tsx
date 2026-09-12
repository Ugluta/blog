import Image from "next/image";
import Link from "next/link";
import { recentPosts } from "@/lib/mockData";

export default function RecentPostsWidget() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
        <span className="text-lg">🕒</span>
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 font-inter">
          Son Yazılar
        </h3>
      </div>

      {/* Posts */}
      <div className="divide-y divide-slate-700/30">
        {recentPosts.map((post, idx) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors group"
          >
            {/* Number */}
            <span
              className="flex-shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center font-inter"
              style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
            >
              {idx + 1}
            </span>

            {/* Thumbnail */}
            <div className="flex-shrink-0 relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-slate-500 font-inter">{post.date}</span>
                <span className="text-slate-600">·</span>
                <span className="text-[10px] text-amber-500/70 font-inter">{post.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-700/30">
        <Link href="/blog" className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-inter">
          Tüm yazıları gör →
        </Link>
      </div>
    </div>
  );
}
