"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Project = {
  id: string;
  title: string;
  status: string;
  thumbnailUrl: string | null;
  duration: number | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-600/30 text-slate-400",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-green-500/20 text-green-400",
  FAILED: "bg-red-500/20 text-red-400",
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Taslak",
  PROCESSING: "İşleniyor",
  COMPLETED: "Tamamlandı",
  FAILED: "Başarısız",
};

export default function ProjelerimPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/video/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Projelerim</h1>
          <p className="text-sm text-slate-400 mt-1">Oluşturulan video projeler</p>
        </div>
        <Link
          href="/uygulama/video-olustur"
          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
        >
          + Yeni Video
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Yükleniyor…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50 border-dashed">
          <div className="text-4xl mb-3">🎬</div>
          <p className="text-slate-400 font-medium">Henüz proje yok</p>
          <p className="text-slate-500 text-sm mt-1 mb-5">İlk videonuzu oluşturun ve sosyal medyada paylaşın.</p>
          <Link
            href="/uygulama/video-olustur"
            className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm"
          >
            + İlk Videoyu Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-colors group"
            >
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                {p.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl text-slate-700">🎬</span>
                )}
                {p.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {Math.floor(p.duration / 60)}:{String(p.duration % 60).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {p.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLE[p.status] ?? "bg-slate-700 text-slate-400"}`}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                  {p.resolution && <span>{p.resolution}</span>}
                  <span>{new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
