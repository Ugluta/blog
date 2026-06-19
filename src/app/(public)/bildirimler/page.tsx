'use client';
import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌', system: '🔔',
};

export default function BildirimlerPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/bildirimler')
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.notifications || []);
        setUnread(d.unreadCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id: string) => {
    await fetch(`/api/bildirimler/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true }),
    });
    setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnread((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await fetch('/api/bildirimler/okundu', { method: 'POST' });
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const remove = async (id: string) => {
    await fetch(`/api/bildirimler/${id}`, { method: 'DELETE' });
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
                  {unread > 0 && (
                    <p className="text-sm text-blue-600">{unread} okunmamış bildirim</p>
                  )}
                </div>
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors">
                  <CheckCheck className="w-4 h-4" /> Tümünü Okundu İşaretle
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container-custom py-8 max-w-2xl">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Yükleniyor…</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz bildiriminiz yok</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id}
                  className={`bg-white rounded-xl border p-4 transition-all ${
                    n.isRead ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{TYPE_ICONS[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${
                        n.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>{n.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                      {n.link && (
                        <a href={n.link} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                          Detaya git →
                        </a>
                      )}
                      <p className="text-xs text-gray-400 mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.isRead && (
                        <button onClick={() => markRead(n.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => remove(n.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
