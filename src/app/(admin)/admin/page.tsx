import { db } from '@/lib/db';
import { DashboardChart } from '@/components/admin/DashboardChart';
import {
  Users, FolderGit2, Code2, Image as ImageIcon, Briefcase, Newspaper,
  Share2, Bot, ArrowUpRight, Plus, Clock, Activity,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default async function AdminDashboardPage() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const [
    projectCount, codeCount, galleryCount, serviceCount,
    newsCount, userCount, socialCount, scraperRuns,
    newUsersToday, recentNews, recentProjects, weekNews, weekProjects,
  ] = await Promise.all([
    db.project.count(),
    db.codeSnippet.count(),
    db.galleryItem.count(),
    db.service.count(),
    db.news.count(),
    db.user.count(),
    db.publisherJob.count({ where: { status: 'PUBLISHED' } }),
    db.scraperJob.count(),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.news.findMany({
      orderBy: { createdAt: 'desc' }, take: 6,
      select: { id: true, title: true, status: true, createdAt: true },
    }),
    db.project.findMany({
      orderBy: { createdAt: 'desc' }, take: 4,
      select: { id: true, title: true, isActive: true, createdAt: true },
    }),
    db.news.findMany({ where: { createdAt: { gte: weekAgo } }, select: { createdAt: true } }),
    db.project.findMany({ where: { createdAt: { gte: weekAgo } }, select: { createdAt: true } }),
  ]);

  // Son 7 gün grafik verisi
  const chart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekAgo);
    d.setDate(d.getDate() + i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const inDay = (arr: { createdAt: Date }[]) =>
      arr.filter((x) => x.createdAt >= d && x.createdAt < next).length;
    return {
      label: DAY_LABELS[(d.getDay() + 6) % 7],
      yazi: inDay(weekNews),
      proje: inDay(weekProjects),
    };
  });

  const bigCards = [
    { label: 'Projeler', value: projectCount, href: '/admin/projeler', Icon: FolderGit2, grad: 'from-emerald-500 to-teal-600' },
    { label: 'Kod Paylaşımı', value: codeCount, href: '/admin/kod', Icon: Code2, grad: 'from-violet-500 to-purple-600' },
    { label: 'Galeri', value: galleryCount, href: '/admin/galeri', Icon: ImageIcon, grad: 'from-pink-500 to-rose-600' },
    { label: 'Hizmetler', value: serviceCount, href: '/admin/hizmetler', Icon: Briefcase, grad: 'from-amber-500 to-orange-600' },
  ];

  const smallCards = [
    { label: 'Blog Yazısı', value: newsCount, href: '/admin/haberler', Icon: Newspaper, color: 'text-blue-600 bg-blue-50' },
    { label: 'Kullanıcı', value: userCount, sub: `+${newUsersToday} bugün`, href: '/admin/kullanicilar', Icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Sosyal Paylaşım', value: socialCount, href: '/admin/sosyal-medya', Icon: Share2, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Scraper Çalışma', value: scraperRuns, href: '/admin/scraper', Icon: Bot, color: 'text-fuchsia-600 bg-fuchsia-50' },
  ];

  const dateStr = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(50%_80%_at_100%_0%,rgba(59,130,246,0.3),transparent)]" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Kontrol Paneli</h1>
            <p className="text-slate-300 text-sm mt-1">{dateStr} — platform durumu</p>
          </div>
          <Link href="/admin/projeler"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
            <Plus className="w-4 h-4" /> Yeni Proje
          </Link>
        </div>
      </div>

      {/* Big gradient cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bigCards.map(({ label, value, href, Icon, grad }) => (
          <Link key={label} href={href}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${grad} text-white p-5 hover:shadow-xl transition-all`}>
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="text-3xl font-extrabold mt-4">{value.toLocaleString('tr-TR')}</p>
            <p className="text-white/80 text-sm mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Small stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {smallCards.map(({ label, value, sub, href, Icon, color }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString('tr-TR')}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-emerald-600 font-medium mt-1">{sub}</p>}
          </Link>
        ))}
      </div>

      {/* Chart + activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Son 7 Gün Aktivite</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Blog</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Proje</span>
            </div>
          </div>
          <DashboardChart data={chart} />
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="space-y-2">
            {[
              { label: 'Yeni Proje Ekle', href: '/admin/projeler', emoji: '📁' },
              { label: 'Kod Paylaş', href: '/admin/kod', emoji: '💻' },
              { label: 'Galeriye Görsel', href: '/admin/galeri', emoji: '🖼️' },
              { label: 'İçerik & Yayın', href: '/admin/icerik', emoji: '🚀' },
              { label: 'Scraper Çalıştır', href: '/admin/scraper', emoji: '🔄' },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
                <span className="text-lg">{a.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent content */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Son Blog Yazıları</h2>
            </div>
            <Link href="/admin/haberler" className="text-xs text-blue-600 hover:underline">Tümü</Link>
          </div>
          {recentNews.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Henüz yazı yok</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentNews.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-3">
                  <p className="text-sm font-medium text-gray-800 truncate pr-3">{n.title}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    n.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {n.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h2 className="font-semibold text-gray-900">Son Projeler</h2>
            </div>
            <Link href="/admin/projeler" className="text-xs text-blue-600 hover:underline">Tümü</Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Henüz proje yok</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <p className="text-sm font-medium text-gray-800 truncate pr-3">{p.title}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    p.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
