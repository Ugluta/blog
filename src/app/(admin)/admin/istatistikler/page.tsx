import { db } from '@/lib/db';
import { BarChart3, TrendingUp, Users, Download, FileText, Eye } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'İstatistikler' };

export default async function IstatistiklerPage() {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalUsers, thisMonthUsers, totalFiles, totalDownloads, thisMonthDownloads,
    totalNews, totalViews, topFiles, topSubjects] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: thisMonth } } }),
    db.file.count({ where: { status: 'APPROVED' } }),
    db.download.count(),
    db.download.count({ where: { createdAt: { gte: thisMonth } } }),
    db.news.count({ where: { status: 'PUBLISHED' } }),
    db.file.aggregate({ _sum: { viewCount: true } }),
    db.file.findMany({
      where: { status: 'APPROVED' },
      orderBy: { downloadCount: 'desc' },
      take: 10,
      select: { title: true, downloadCount: true, viewCount: true, subject: { select: { name: true } } },
    }),
    db.subject.findMany({
      include: { _count: { select: { files: true, questions: true } } },
      orderBy: { sortOrder: 'asc' },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> İstatistikler
        </h1>
        <p className="text-gray-500 text-sm">Platform genel durumu</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Toplam Üye" value={totalUsers.toLocaleString()} change={`+${thisMonthUsers} bu ay`} changeType="up" icon={Users} />
        <StatCard title="Onay. Dosya" value={totalFiles.toLocaleString()} icon={FileText} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="İndirme" value={totalDownloads.toLocaleString()} change={`+${thisMonthDownloads} bu ay`} changeType="up" icon={Download} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Haberler" value={totalNews.toLocaleString()} icon={TrendingUp} iconColor="text-orange-500" iconBg="bg-orange-50" />
        <StatCard title="Toplam Görüntüleme" value={(totalViews._sum.viewCount || 0).toLocaleString()} icon={Eye} iconColor="text-teal-600" iconBg="bg-teal-50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Files */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">En Çok İndirilen Dosyalar</h2>
          <div className="space-y-3">
            {topFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.title}</p>
                  <p className="text-xs text-gray-400">{file.subject?.name || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{file.downloadCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">İndirme</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Subjects */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ders Bazlı İçerik</h2>
          <div className="space-y-3">
            {topSubjects.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-sm">{sub.icon || '📖'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                  <div className="flex gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min((sub._count.files / (topFiles[0]?.downloadCount || 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{sub._count.files}</p>
                  <p className="text-xs text-gray-400">Dosya</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
