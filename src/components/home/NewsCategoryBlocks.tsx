import Image from "next/image";
import Link from "next/link";
import { newsCategories, categoryNewsBlocks } from "@/lib/mockData";

function CategoryBlock({ categoryId }: { categoryId: string }) {
  const cat = newsCategories.find((c) => c.id === categoryId)!;
  const items = categoryNewsBlocks[categoryId] ?? [];
  const [main, ...rest] = items;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-colors">
      {/* Category Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50"
        style={{ borderLeft: `4px solid ${cat.color}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.icon}</span>
          <h3
            className="font-bold text-sm uppercase tracking-wider font-inter"
            style={{ color: cat.color }}
          >
            {cat.name}
          </h3>
        </div>
        <Link
          href={`/haberler/${cat.id}`}
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-inter flex items-center gap-1"
        >
          Tümünü Gör
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Main news item */}
      {main && (
        <Link href={`/haber/${main.id}`} className="block group px-4 pt-4 pb-3 hover:bg-slate-700/30 transition-colors">
          <div className="flex gap-3">
            <div className="flex-shrink-0 relative w-24 h-16 rounded-lg overflow-hidden img-zoom-container bg-slate-700">
              <Image src={main.image} alt={main.title} fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-snug text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                {main.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-slate-500 font-inter">{main.author}</span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-500 font-inter">{main.time}</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Divider */}
      <div className="mx-4 h-px bg-slate-700/50" />

      {/* Rest of news */}
      <div className="px-4 pb-3 space-y-0">
        {rest.slice(0, 3).map((item, idx) => (
          <div key={item.id}>
            <Link
              href={`/haber/${item.id}`}
              className="flex items-start gap-2.5 py-2.5 group hover:bg-slate-700/20 transition-colors rounded -mx-1 px-1"
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center mt-0.5"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
              >
                {idx + 2}
              </span>
              <div>
                <h4 className="text-xs font-medium leading-snug text-slate-300 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-[10px] text-slate-500 font-inter mt-0.5 block">{item.time}</span>
              </div>
            </Link>
            {idx < 2 && <div className="h-px bg-slate-700/30" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewsCategoryBlocks() {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold section-header" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kategoriye Göre Haberler
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Object.keys(categoryNewsBlocks).map((catId) => (
          <CategoryBlock key={catId} categoryId={catId} />
        ))}
      </div>
    </section>
  );
}
