'use client';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeleteButton({
  endpoint, disabled, confirmText = 'Bu kayıt silinsin mi?', title,
}: {
  endpoint: string;
  disabled?: boolean;
  confirmText?: string;
  title?: string;
}) {
  const router = useRouter();

  async function del() {
    if (disabled) return;
    if (!confirm(confirmText)) return;
    const res = await fetch(endpoint, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || 'Silinemedi (ilişkili kayıtlar veya yetki).');
    }
  }

  return (
    <button
      onClick={del}
      disabled={disabled}
      title={disabled ? (title ?? 'Silinemez') : 'Sil'}
      className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${
        disabled ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
