'use client';
import { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  location: string;
  sortOrder: number;
  isActive: boolean;
}

export default function TemaPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'theme'>('menu');
  const [headerItems, setHeaderItems] = useState<MenuItem[]>([]);
  const [footerItems, setFooterItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ label: '', url: '', location: 'header' });
  const [theme, setTheme] = useState({ primaryColor: '#2563eb', logo: '', siteName: 'ÖğretmenEvrak' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load menu items and settings
    fetch('/api/menu').then((r) => r.json()).then((d) => {
      setHeaderItems((d.data || []).filter((m: MenuItem) => m.location === 'header'));
      setFooterItems((d.data || []).filter((m: MenuItem) => m.location === 'footer'));
    }).catch(() => {});
  }, []);

  const addItem = async () => {
    if (!newItem.label || !newItem.url) return;
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    if (data.success) {
      if (newItem.location === 'header') setHeaderItems((prev) => [...prev, data.data]);
      else setFooterItems((prev) => [...prev, data.data]);
      setNewItem({ label: '', url: '', location: 'header' });
    }
  };

  const removeItem = async (id: string, location: string) => {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    if (location === 'header') setHeaderItems((prev) => prev.filter((i) => i.id !== id));
    else setFooterItems((prev) => prev.filter((i) => i.id !== id));
  };

  const saveTheme = async () => {
    setSaving(true);
    await fetch('/api/ayarlar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          primary_color: theme.primaryColor,
          logo_url: theme.logo,
          site_name: theme.siteName,
        },
      }),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5" /> Tema & Menü Ayarları
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {[{ id: 'menu', label: 'Menü Yönetimi' }, { id: 'theme', label: 'Tema Ayarları' }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'menu' | 'theme')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'menu' && (
        <div className="space-y-5">
          {/* Add Item */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold mb-3">Yeni Menü Öğesi</h3>
            <div className="flex gap-3">
              <input value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Etiket (ör. Dosyalar)" />
              <input value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="URL (ör. /dosyalar)" />
              <select value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className="h-10 px-3 rounded-lg border border-gray-200 text-sm">
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
              <Button onClick={addItem} size="icon"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Header Menu */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold mb-3">Header Menüsi ({headerItems.length} öğe)</h3>
            <div className="space-y-2">
              {headerItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100">
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.url}</span>
                  <button onClick={() => removeItem(item.id, 'header')} className="p-1 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {headerItems.length === 0 && <p className="text-sm text-gray-400">Henüz menü öğesi yok</p>}
            </div>
          </div>

          {/* Footer Menu */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold mb-3">Footer Menüsi ({footerItems.length} öğe)</h3>
            <div className="space-y-2">
              {footerItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100">
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.url}</span>
                  <button onClick={() => removeItem(item.id, 'footer')} className="p-1 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {footerItems.length === 0 && <p className="text-sm text-gray-400">Henüz menü öğesi yok</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Site Adı</label>
              <input value={theme.siteName} onChange={(e) => setTheme({ ...theme, siteName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Logo URL</label>
              <input value={theme.logo} onChange={(e) => setTheme({ ...theme, logo: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/logo.svg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Ana Renk</label>
              <div className="flex gap-2">
                <input type="color" value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                <input value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Renk Önizleme</label>
              <div className="flex gap-2">
                {['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2'].map((c) => (
                  <button key={c} onClick={() => setTheme({ ...theme, primaryColor: c })}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: theme.primaryColor === c ? '#000' : 'transparent' }}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button onClick={saveTheme} loading={saving}><Save className="w-4 h-4" /> Kaydet</Button>
        </div>
      )}
    </div>
  );
}
