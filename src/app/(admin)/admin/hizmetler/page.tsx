import { CrudManager, type Field } from '@/components/admin/CrudManager';

const fields: Field[] = [
  { name: 'title', label: 'Başlık', type: 'text', required: true, placeholder: 'Hizmet adı' },
  { name: 'price', label: 'Fiyat', type: 'text', placeholder: 'ör: 5.000₺’den başlayan' },
  { name: 'description', label: 'Açıklama', type: 'textarea', required: true, placeholder: 'Hizmet açıklaması' },
  { name: 'features', label: 'Özellikler', type: 'textarea', placeholder: 'Her satıra bir özellik', help: 'Her satır ayrı bir madde olur' },
  { name: 'sortOrder', label: 'Sıra', type: 'number', placeholder: '0' },
];

export default function AdminHizmetlerPage() {
  return <CrudManager endpoint="/api/hizmetler" title="Hizmetler" subtitle="Hizmet ekle ve yönet" fields={fields} />;
}
