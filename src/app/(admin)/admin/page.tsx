import { db } from '@/lib/db';
import { StatCard } from '@/components/ui/stat-card';
import { Users, FolderOpen, Download, Newspaper, HelpCircle, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalFiles, totalDownloads, totalNews, totalQuestions,
    newUsersToday, downloadsToday, pendingFiles, activeAds, recentFiles] = await Promise.all([
    db.user.count(),
    db.file.count({ where: { status: 'APPROVED' } }),
    db.download.count(),
    db.news.count({ where: { status: 'PUBLISHED' } }),
    db.question.count({ where: { isApproved: true } }),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.download.count({ where: { createdAt: { gte: today } } }),
    db.file.count({ where: { status: 'PENDING' } }),
    db.advertisement.count({ where: { isActive: true } }),
    db.file.findMany({
      where: { status: 'PENDING' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{formatDate(new Date())} itibariyle platform durumu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Toplam Kullanıcı" value={totalUsers.toLocaleString()} change={`+${newUsersToday} bugün`} changeType="up" icon={Users} />
        <StatCard title="Onay. Dosya" value={totalFiles.toLocaleString()} icon={FolderOpen} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="İndirme" value={totalDownloads.toLocaleString()} change={`+${downloadsToday} bugün`} changeType="up" icon={Download} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Haberler" value={totalNews.toLocaleString()} icon={Newspaper} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Sorular" value={totalQuestions.toLocaleString()} icon={HelpCircle} iconColor="text-teal-600" iconBg="bg-teal-50" />
      </div>

      {/* Alerts */}
      {pendingFiles > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{pendingFiles} dosya onay bekliyor</p>
            <Link href="/admin/dosyalar?durum=PENDING" className="text-xs text-amber-700 hover:underline">Hemen incele →</Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Files */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-gray-900">Onay Bekleyen Dosyalar</h2>
            </div>
            <Link href="/admin/dosyalar?durum=PENDING" className="text-xs text-blue-600 hover:underline">Tümünü gör</Link>
          </div>
          {recentFiles.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Onay bekleyen dosya yok ✅</p>
          ) : (
            <div className="space-y-2">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.title}</p>
                    <p className="text-xs text-gray-400">{file.author.name} · {formatDate(file.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-3">
                    <Link
                      href={`/admin/dosyalar/${file.id}`}
                      className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                    >
                      İncele
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Hızlı İşlemler</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Yeni Haber', href: '/admin/haberler/yeni', emoji: '📝' },
              { label: 'Dosya Yükle', href: '/admin/dosyalar/yukle', emoji: '📂' },
              { label: 'Soru Ekle', href: '/admin/sorular/yeni', emoji: '❓' },
              { label: 'Belge Oluştur', href: '/admin/belgeler/yeni', emoji: '🤖' },
              { label: 'Scraper Çalıştır', href: '/admin/scraper', emoji: '🔄' },
              { label: 'Reklam Ekle', href: '/admin/reklamlar/yeni', emoji: '📺' },
              { label: 'Kategori Ekle', href: '/admin/kategoriler', emoji: '📁' },
              { label: 'Ayarlar', href: '/admin/ayarlar', emoji: '⚙️' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <span className="text-xl">{action.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
