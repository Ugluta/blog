import Link from "next/link";
import { mostCommentedPosts } from "@/lib/mockData";

const categoryColors: Record<string, string> = {
  Teknoloji: "text-blue-400",
  Ekonomi: "text-emerald-400",
  Dünya: "text-purple-400",
  Spor: "text-red-400",
  Sağlık: "text-cyan-400",
  Kültür: "text-amber-400",
};

export default function MostCommentedWidget() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
        <span className="text-lg">💬</span>
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 font-inter">
          Çok Yorumlanan
        </h3>
      </div>

      {/* Posts */}
      <div className="divide-y divide-slate-700/30">
        {mostCommentedPosts.map((post, idx) => {
          const catColor = categoryColors[post.category] ?? "text-slate-400";
          const isTop = idx === 0;

          return (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors group"
            >
              {/* Rank / Fire */}
              <div className="flex-shrink-0 flex flex-col items-center w-8">
                {isTop ? (
                  <span className="text-lg" title="En çok yorumlanan">🔥</span>
                ) : (
                  <span
                    className="w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center font-inter mt-0.5"
                    style={{ backgroundColor: "rgba(100,116,139,0.2)", color: "#94A3B8" }}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1.5">
                  {post.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold font-inter ${catColor}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-inter">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-bold text-slate-300">{post.commentCount.toLocaleString("tr-TR")}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
