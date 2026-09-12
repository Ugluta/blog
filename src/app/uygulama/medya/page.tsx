"use client";

import { useState, useEffect, useRef } from "react";

type MediaFile = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  duration: number | null;
  createdAt: string;
};

const ACCEPT = "audio/*,video/*,image/*";
const TYPES: Record<string, string> = {
  "audio/": "🎵",
  "video/": "🎬",
  "image/": "🖼️",
};

function getIcon(mime: string) {
  const entry = Object.entries(TYPES).find(([k]) => mime.startsWith(k));
  return entry?.[1] ?? "📄";
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MedyaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/media").catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setFiles(data.files ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/media", { method: "POST", body: fd }).catch(() => null);
    if (!res?.ok) {
      alert("Yükleme başarısız.");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/media/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    setFiles((f) => f.filter((x) => x.id !== deleteId));
  };

  const audioFiles = files.filter((f) => f.mimeType.startsWith("audio/"));
  const videoFiles = files.filter((f) => f.mimeType.startsWith("video/"));
  const imageFiles = files.filter((f) => f.mimeType.startsWith("image/"));
  const totalSize = files.reduce((a, f) => a + f.size, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Medya Kütüphanesi</h1>
          <p className="text-sm text-[#666666] mt-1">
            {files.length} dosya • {fmtSize(totalSize)} kullanılıyor
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-5 py-2 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {uploading ? "Yükleniyor…" : "+ Dosya Yükle"}
        </button>
        <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={handleUpload} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Ses", count: audioFiles.length, icon: "🎵" },
          { label: "Video", count: videoFiles.length, icon: "🎬" },
          { label: "Görsel", count: imageFiles.length, icon: "🖼️" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E7E2D8] rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-black text-[#111111]">{s.count}</div>
            <div className="text-xs text-[#666666]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Files */}
      {loading ? (
        <div className="text-center py-16 text-[#666666]">Yükleniyor…</div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E2D8] border-dashed">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-[#666666] font-medium">Henüz dosya yok</p>
          <p className="text-[#666666] text-sm mt-1 mb-5">Ses, video veya görsel dosyalarınızı yükleyin.</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-block px-5 py-2.5 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm"
          >
            Dosya Yükle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {files.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-[#E7E2D8] rounded-xl overflow-hidden group"
            >
              {f.mimeType.startsWith("image/") ? (
                <div className="aspect-square relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.url}
                    alt={f.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-[#F8F6F1] flex items-center justify-center text-5xl">
                  {getIcon(f.mimeType)}
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-[#111111] truncate font-medium">{f.originalName}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#666666]">{fmtSize(f.size)}</span>
                  <button
                    onClick={() => setDeleteId(f.id)}
                    className="text-[10px] text-[#666666] hover:text-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7E2D8] w-full max-w-sm p-6">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="font-bold text-[#111111] text-lg mb-2">Dosyayı Sil?</h3>
            <p className="text-sm text-[#666666] mb-5">Bu dosya kalıcı olarak silinecek.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[#E7E2D8] text-[#444444] py-2 rounded-lg text-sm hover:bg-[#EBF2FA]"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
