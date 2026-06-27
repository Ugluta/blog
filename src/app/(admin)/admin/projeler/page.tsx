import { CrudManager, type Field } from '@/components/admin/CrudManager';

const fields: Field[] = [
  { name: 'title', label: 'Başlık', type: 'text', required: true, placeholder: 'Proje adı' },
  { name: 'description', label: 'Açıklama', type: 'textarea', required: true, placeholder: 'Kısa açıklama' },
  { name: 'coverImage', label: 'Kapak Görseli URL', type: 'url', placeholder: 'https://...' },
  { name: 'liveUrl', label: 'Canlı Site URL', type: 'url', placeholder: 'https://...' },
  { name: 'repoUrl', label: 'Kod Deposu URL', type: 'url', placeholder: 'https://github.com/...' },
  { name: 'tags', label: 'Etiketler', type: 'text', placeholder: 'Next.js, TypeScript', help: 'Virgülle ayırın' },
  { name: 'sortOrder', label: 'Sıra', type: 'number', placeholder: '0' },
  { name: 'isFeatured', label: 'Öne Çıkar', type: 'checkbox', placeholder: 'Ana sayfada önce göster' },
];

export default function AdminProjelerPage() {
  return <CrudManager endpoint="/api/projeler" title="Projeler" subtitle="Proje ekle, düzenle ve yönet" fields={fields} />;
}
