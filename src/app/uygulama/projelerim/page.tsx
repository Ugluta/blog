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
  DRAFT: "bg-[#E7E2D8] text-[#666666]",
  PROCESSING: "bg-blue-500/20 text-blue-600",
  COMPLETED: "bg-green-500/20 text-green-600",
  FAILED: "bg-red-500/20 text-red-600",
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
          <h1 className="text-2xl font-bold text-[#111111]">Projelerim</h1>
          <p className="text-sm text-[#666666] mt-1">Oluşturulan video projeler</p>
        </div>
        <Link
          href="/uygulama/video-olustur"
          className="px-5 py-2 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors"
        >
          + Yeni Video
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#666666]">Yükleniyor…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E2D8] border-dashed">
          <div className="text-4xl mb-3">🎬</div>
          <p className="text-[#666666] font-medium">Henüz proje yok</p>
          <p className="text-[#666666] text-sm mt-1 mb-5">İlk videonuzu oluşturun ve sosyal medyada paylaşın.</p>
          <Link
            href="/uygulama/video-olustur"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm"
          >
            + İlk Videoyu Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#E7E2D8] hover:border-[#3A6EA8]/30 rounded-2xl overflow-hidden transition-colors group"
            >
              <div className="aspect-video bg-[#F8F6F1] relative flex items-center justify-center">
                {p.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl text-[#444444]">🎬</span>
                )}
                {p.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {Math.floor(p.duration / 60)}:{String(p.duration % 60).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 group-hover:text-[#2D5A8E] transition-colors">
                    {p.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLE[p.status] ?? "bg-[#EBF2FA] text-[#666666]"}`}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[#666666]">
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
