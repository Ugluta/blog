import Image from "next/image";
import Link from "next/link";
import { heroNewsItems } from "@/lib/mockData";

const categoryColors: Record<string, string> = {
  Teknoloji: "badge-teknoloji",
  Ekonomi: "badge-ekonomi",
  Dünya: "badge-dunya",
  Spor: "badge-spor",
  Sağlık: "badge-saglik",
  Kültür: "badge-kultur",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = categoryColors[category] ?? "bg-slate-700 text-slate-300";
  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded ${cls}`}>
      {category}
    </span>
  );
}

export default function HeroSection() {
  const [main, ...side] = heroNewsItems;

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <Link href={`/haber/${main.id}`} className="block group">
            <div className="relative rounded-xl overflow-hidden img-zoom-container bg-slate-800">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <Image
                  src={main.image}
                  alt={main.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              </div>
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={main.category} />
                  <span className="text-xs text-slate-400 font-inter">{main.time}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white group-hover:text-amber-300 transition-colors mb-2">
                  {main.title}
                </h2>
                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed hidden sm:block">
                  {main.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                    {main.author.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-400 font-inter">{main.author}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Articles */}
        <div className="flex flex-col gap-3">
          {side.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href={`/haber/${item.id}`}
              className="flex gap-3 group bg-slate-800 rounded-xl p-3 hover:bg-slate-700/70 transition-colors news-card-hover"
            >
              <div className="flex-shrink-0 relative w-20 h-16 rounded-lg overflow-hidden img-zoom-container bg-slate-700">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <CategoryBadge category={item.category} />
                  <span className="text-[10px] text-slate-500 font-inter">{item.time}</span>
                </div>
                <h3 className="text-sm font-semibold leading-snug text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-[11px] text-slate-500 mt-1 block font-inter">{item.author}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
