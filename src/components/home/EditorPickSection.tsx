import Image from "next/image";
import Link from "next/link";
import { heroNewsItems } from "@/lib/mockData";

export default function EditorPickSection() {
  const picks = heroNewsItems.slice(0, 4);
  return (
    <section className="py-12" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-white">Editörün Seçimi</h2>
          </div>
          <Link href="/blog" className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1">
            Tümü <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {picks.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.id}`}
              className="group flex overflow-hidden rounded-xl border border-slate-700/30 hover:border-amber-500/30 transition-colors shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-amber-500/5"
              style={{ backgroundColor: "#0F172A" }}
            >
              <div className="relative flex-shrink-0 rounded-l-xl overflow-hidden" style={{ width: 160, height: 130 }}>
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="160px" />
              </div>
              <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 mb-1 self-start">{item.category}</span>
                <span className="text-[10px] text-slate-500 mb-1.5">{item.time}</span>
                <h3 className="text-sm font-bold leading-snug text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-3">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
