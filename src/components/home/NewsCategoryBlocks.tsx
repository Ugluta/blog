import Image from "next/image";
import Link from "next/link";
import { newsCategories, categoryNewsBlocks } from "@/lib/mockData";

const SHOW_CATEGORIES = ["teknoloji", "ekonomi", "saglik", "kultur"];

function CategoryRow({ categoryId }: { categoryId: string }) {
  const cat = newsCategories.find((c) => c.id === categoryId);
  if (!cat) return null;
  const items = categoryNewsBlocks[categoryId] ?? [];

  return (
    <div className="mb-10">
      {/* Category header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase text-white" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
            {cat.name}
          </span>
        </div>
        <Link
          href={`/blog`}
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
        >
          Tümünü Gör <span>→</span>
        </Link>
      </div>

      {/* News cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/blog/${item.id}`}
            className="flex gap-3 group rounded-xl border border-slate-700/30 hover:border-amber-500/30 transition-colors p-3 shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-amber-500/5"
            style={{ backgroundColor: "#0F172A" }}
          >
            {/* Image 80px */}
            <div
              className="flex-shrink-0 relative overflow-hidden img-zoom-container bg-slate-800 rounded-lg"
              style={{ width: 80, height: 64 }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold leading-snug text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-3 mb-1">
                {item.title}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span>{item.author}</span>
                <span className="text-slate-700">·</span>
                <span>{item.time}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function NewsCategoryBlocks() {
  return (
    <section className="py-12" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-white">İçerikler</h2>
          </div>
        </div>

        {SHOW_CATEGORIES.map((catId) => (
          <CategoryRow key={catId} categoryId={catId} />
        ))}
      </div>
    </section>
  );
}
