import Image from "next/image";
import Link from "next/link";
import { heroNewsItems } from "@/lib/mockData";

const categoryClass: Record<string, string> = {
  Teknoloji: "badge-teknoloji",
  Ekonomi: "badge-ekonomi",
  Dünya: "badge-dunya",
  Spor: "badge-spor",
  Sağlık: "badge-saglik",
  Kültür: "badge-kultur",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = categoryClass[category] ?? "bg-slate-700 text-slate-300";
  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${cls}`}
    >
      {category}
    </span>
  );
}

export default function HeroSection() {
  const [main, ...side] = heroNewsItems;

  return (
    <section className="py-8 anim-fade-up" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ── Main featured story (2/3 width) ─── */}
          <div className="lg:col-span-2">
            <Link href={`/haber/${main.id}`} className="block group">
              <div
                className="relative overflow-hidden img-zoom-container bg-slate-800 rounded-2xl shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-amber-500/5 transition-shadow"
              >
                {/* Image with 16:9 ratio */}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <Image
                    src={main.image}
                    alt={main.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryBadge category={main.category} />
                    <span className="text-xs text-slate-400">{main.time}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-white group-hover:text-amber-300 transition-colors mb-2">
                    {main.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 hidden sm:block mb-3">
                    {main.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0"
                      style={{ backgroundColor: "rgba(245,158,11,0.15)", borderRadius: "50%" }}
                    >
                      {main.author.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-400">{main.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* ── Side stories (1/3 width) ─── */}
          <div className="flex flex-col gap-3">
            {side.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/haber/${item.id}`}
                className="flex gap-3 group border border-slate-700/30 hover:border-amber-500/30 transition-colors p-3 rounded-xl shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-amber-500/5"
                style={{ backgroundColor: "#0F172A" }}
              >
                {/* Small image 72px */}
                <div
                  className="flex-shrink-0 relative overflow-hidden img-zoom-container bg-slate-700 rounded-lg"
                  style={{ width: 72, height: 72 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </div>

                {/* Text right */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CategoryBadge category={item.category} />
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 block">{item.author}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
