import { CrudManager, type Field } from '@/components/admin/CrudManager';

const fields: Field[] = [
  { name: 'title', label: 'Başlık', type: 'text', required: true, placeholder: 'Görsel başlığı' },
  { name: 'imageUrl', label: 'Görsel URL', type: 'url', required: true, placeholder: 'https://...' },
  { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Tasarım, Fotoğraf...' },
  { name: 'description', label: 'Açıklama', type: 'textarea', placeholder: 'Opsiyonel açıklama' },
  { name: 'sortOrder', label: 'Sıra', type: 'number', placeholder: '0' },
];

export default function AdminGaleriPage() {
  return <CrudManager endpoint="/api/galeri" title="Galeri" subtitle="Görsel ekle ve yönet" fields={fields} />;
}
