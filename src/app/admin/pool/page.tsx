"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  rawTitle: string;
  aiTitle: string | null;
  status: string;
  failureReason: string | null;
  createdAt: string;
  category: { name: string } | null;
  source: { name: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  SCRAPED: "Havuzda (ham)",
  REVISING: "AI revize ediyor…",
  IN_REVIEW: "Onay bekliyor",
  REJECTED: "Reddedildi",
  FAILED: "Hata",
};

export default function PoolPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/pool");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, action: "approve" | "reject") {
    setBusyId(id);
    try {
      await fetch(`/api/admin/pool/${id}/${action}`, { method: "POST" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-sax">İçerik Havuzu</h1>
        <nav className="flex gap-4 text-sm">
          <a href="/admin/sources" className="text-ink/60 hover:text-sax">
            Kaynaklar
          </a>
          <a href="/admin/settings" className="text-ink/60 hover:text-sax">
            Ayarlar
          </a>
        </nav>
      </div>

      {loading ? (
        <p className="text-ink/60">Yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/60">Havuz boş. Worker çalıştığında yeni öğeler burada görünecek.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="bg-white border border-ink/10 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block text-xs px-2 py-0.5 rounded bg-sax/10 text-sax mb-1">
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                  <h2 className="font-semibold">{item.aiTitle || item.rawTitle}</h2>
                  <p className="text-xs text-ink/50 mt-1">
                    {item.source?.name || "—"} · {item.category?.name || "kategori yok"}
                  </p>
                  {item.failureReason && (
                    <p className="text-xs text-red-600 mt-1">{item.failureReason}</p>
                  )}
                </div>
                {item.status === "IN_REVIEW" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => act(item.id, "approve")}
                      disabled={busyId === item.id}
                      className="text-sm bg-sax text-white px-3 py-1.5 rounded-md hover:bg-sax/90 disabled:opacity-50"
                    >
                      Onayla &amp; Yayınla
                    </button>
                    <button
                      onClick={() => act(item.id, "reject")}
                      disabled={busyId === item.id}
                      className="text-sm border border-ink/20 px-3 py-1.5 rounded-md hover:bg-ink/5 disabled:opacity-50"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
