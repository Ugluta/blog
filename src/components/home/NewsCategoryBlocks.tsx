import Image from "next/image";
import Link from "next/link";
import { newsCategories, categoryNewsBlocks } from "@/lib/mockData";

const SHOW_CATEGORIES = ["teknoloji", "ekonomi", "dunya", "spor"];

function CategoryRow({ categoryId }: { categoryId: string }) {
  const cat = newsCategories.find((c) => c.id === categoryId);
  if (!cat) return null;
  const items = categoryNewsBlocks[categoryId] ?? [];

  return (
    <div className="mb-10">
      {/* Category header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-0"
          style={{ borderLeft: "3px solid #F59E0B", paddingLeft: "0.75rem" }}
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">
            {cat.name}
          </h3>
        </div>
        <Link
          href={`/haberler/${cat.id}`}
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
        >
          Tümünü Gör →
        </Link>
      </div>

      {/* News cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/haber/${item.id}`}
            className="flex gap-3 group border border-slate-700/30 hover:border-amber-500/30 transition-colors p-3"
            style={{ backgroundColor: "#0F172A", borderRadius: "2px" }}
          >
            {/* Image 80px */}
            <div
              className="flex-shrink-0 relative overflow-hidden img-zoom-container bg-slate-800"
              style={{ width: 80, height: 64, borderRadius: "1px" }}
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
    <section className="py-10" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section title */}
        <div className="mb-8" style={{ borderLeft: "3px solid #F59E0B", paddingLeft: "0.75rem" }}>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Haberler
          </h2>
        </div>

        {SHOW_CATEGORIES.map((catId) => (
          <CategoryRow key={catId} categoryId={catId} />
        ))}
      </div>
    </section>
  );
}
