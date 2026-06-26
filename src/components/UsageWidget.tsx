'use client';
import { useEffect, useState } from 'react';

type UsageLimitEntry = { used: number; limit: number | null; percent: number | null };

type UsageData = {
  plan: { name: string } | null;
  limits: {
    downloads: UsageLimitEntry;
    uploads: UsageLimitEntry;
    storage: UsageLimitEntry;
    aiDaily: { used: number; limit: number; percent: number };
  };
  membershipStatus: string;
  membershipExpiry: string | null;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

function UsageBar({
  label, used, limit, percent, formatVal,
}: {
  label: string;
  used: number;
  limit: number | null;
  percent: number | null;
  formatVal?: (n: number) => string;
}) {
  const fmt = formatVal ?? String;
  const pct = percent ?? 0;
  const barColor =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-500">
          {fmt(used)}{limit != null ? ` / ${fmt(limit)}` : ' (sınırsız)'}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: limit != null ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export function UsageWidget() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kullanim')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-5" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Kota Kullanımı</h2>
        {data.plan && (
          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            {data.plan.name}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <UsageBar
          label="Aylık İndirmeler"
          used={data.limits.downloads.used}
          limit={data.limits.downloads.limit}
          percent={data.limits.downloads.percent}
        />
        <UsageBar
          label="Yüklenen Dosyalar"
          used={data.limits.uploads.used}
          limit={data.limits.uploads.limit}
          percent={data.limits.uploads.percent}
        />
        <UsageBar
          label="Depolama Alanı"
          used={data.limits.storage.used}
          limit={data.limits.storage.limit}
          percent={data.limits.storage.percent}
          formatVal={formatBytes}
        />
        <UsageBar
          label="Günlük AI Kullanımı"
          used={data.limits.aiDaily.used}
          limit={data.limits.aiDaily.limit}
          percent={data.limits.aiDaily.percent}
        />
      </div>

      {data.membershipExpiry && (
        <p className="text-xs text-gray-400 mt-4 text-right">
          Üyelik bitiş:{' '}
          {new Date(data.membershipExpiry).toLocaleDateString('tr-TR')}
        </p>
      )}
    </div>
  );
}
