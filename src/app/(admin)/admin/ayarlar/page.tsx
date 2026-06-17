'use client';
import { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Setting {
  key: string;
  value: string;
  label?: string;
  group: string;
  type: string;
}

const GROUPS: Record<string, string> = {
  general: 'Genel',
  appearance: 'Görünüm',
  auth: 'Üyelik & Güvenlik',
  content: 'İçerik',
  seo: 'SEO',
};

export default function AyarlarPage() {
  const [settings, setSettings] = useState<Record<string, Setting[]>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/ayarlar').then((r) => r.json()).then((data) => {
      const grouped: Record<string, Setting[]> = {};
      const vals: Record<string, string> = {};
      (data.data || []).forEach((s: Setting) => {
        if (!grouped[s.group]) grouped[s.group] = [];
        grouped[s.group].push(s);
        vals[s.key] = s.value;
      });
      setSettings(grouped);
      setValues(vals);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/ayarlar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: values }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5" /> Site Ayarları
        </h1>
        <Button onClick={save} loading={saving}>
          {saved ? '✓ Kaydedildi' : <><Save className="w-4 h-4" /> Kaydet</>}
        </Button>
      </div>

      {Object.entries(GROUPS).map(([group, groupLabel]) => (
        settings[group]?.length > 0 && (
          <div key={group} className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">{groupLabel}</h2>
            <div className="grid grid-cols-2 gap-4">
              {settings[group]?.map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{setting.label || setting.key}</label>
                  {setting.type === 'boolean' ? (
                    <label className="relative inline-flex cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values[setting.key] === 'true'}
                        onChange={(e) => setValues({ ...values, [setting.key]: e.target.checked ? 'true' : 'false' })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  ) : setting.type === 'color' ? (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={values[setting.key] || '#000000'}
                        onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-gray-200"
                      />
                      <input
                        value={values[setting.key] || ''}
                        onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                        className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <input
                      value={values[setting.key] || ''}
                      onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
