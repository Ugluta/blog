'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function NewsRowActions({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();

  async function del() {
    if (!confirm('Bu içerik silinsin mi?')) return;
    const res = await fetch(`/api/haberler/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
    else alert('Silinemedi (yetki gerekebilir)');
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/haberler/${slug}`} target="_blank" title="Görüntüle"
        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
        <Eye className="w-4 h-4" />
      </Link>
      <Link href={`/admin/haberler/${id}/duzenle`} title="Düzenle"
        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
        <Pencil className="w-4 h-4" />
      </Link>
      <button onClick={del} title="Sil"
        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
