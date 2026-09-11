"use client";

import { useEffect, useState } from "react";

type Source = {
  id: string;
  name: string;
  url: string;
  type: "RSS" | "HTML";
  active: boolean;
  lastScrapedAt: string | null;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"RSS" | "HTML">("RSS");

  async function load() {
    const res = await fetch("/api/admin/sources");
    const data = await res.json();
    setSources(data.sources || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addSource(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, type }),
    });
    setName("");
    setUrl("");
    await load();
  }

  async function toggleActive(source: Source) {
    await fetch(`/api/admin/sources/${source.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !source.active }),
    });
    await load();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <a href="/admin/pool" className="text-sm text-ink/60 hover:text-sax">
        ← Havuz
      </a>
      <h1 className="text-2xl font-bold text-sax mt-2 mb-6">Kaynaklar</h1>

      <form onSubmit={addSource} className="bg-white border border-ink/10 rounded-lg p-4 mb-8 flex gap-2 flex-wrap">
        <input
          placeholder="Ad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 min-w-[140px] rounded-md border border-ink/20 px-3 py-2 text-sm"
        />
        <input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex-[2] min-w-[200px] rounded-md border border-ink/20 px-3 py-2 text-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "RSS" | "HTML")}
          className="rounded-md border border-ink/20 px-3 py-2 text-sm"
        >
          <option value="RSS">RSS</option>
          <option value="HTML">HTML</option>
        </select>
        <button type="submit" className="bg-sax text-white px-4 py-2 rounded-md text-sm">
          Ekle
        </button>
      </form>

      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s.id} className="bg-white border border-ink/10 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-ink/50">{s.url} · {s.type}</p>
            </div>
            <button
              onClick={() => toggleActive(s)}
              className={`text-xs px-2 py-1 rounded ${s.active ? "bg-sax/10 text-sax" : "bg-ink/10 text-ink/50"}`}
            >
              {s.active ? "Aktif" : "Pasif"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
