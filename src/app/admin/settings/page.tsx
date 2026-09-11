"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [autoPublish, setAutoPublish] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    const setting = (data.settings || []).find((s: { key: string }) => s.key === "auto_publish");
    setAutoPublish(setting?.value === "true");
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle() {
    setSaving(true);
    const next = !autoPublish;
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "auto_publish", value: String(next) }),
    });
    setAutoPublish(next);
    setSaving(false);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <a href="/admin/pool" className="text-sm text-ink/60 hover:text-sax">
        ← Havuz
      </a>
      <h1 className="text-2xl font-bold text-sax mt-2 mb-6">Ayarlar</h1>

      <div className="bg-white border border-ink/10 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">Otomatik yayın</p>
          <p className="text-xs text-ink/50">
            Açıksa, AI revizyonundan geçen içerikler moderasyon beklemeden otomatik yayınlanır.
            Kapalıysa (önerilen), her öğe /admin/pool üzerinden elle onaylanır.
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          className={`text-sm px-3 py-1.5 rounded-md ${
            autoPublish ? "bg-sax text-white" : "border border-ink/20"
          }`}
        >
          {autoPublish ? "Açık" : "Kapalı"}
        </button>
      </div>
    </main>
  );
}
