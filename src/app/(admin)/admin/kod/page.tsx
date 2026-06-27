import { CrudManager, type Field } from '@/components/admin/CrudManager';

const fields: Field[] = [
  { name: 'title', label: 'Başlık', type: 'text', required: true, placeholder: 'Kod parçası başlığı' },
  { name: 'language', label: 'Dil', type: 'text', placeholder: 'typescript, python, bash...' },
  { name: 'description', label: 'Açıklama', type: 'textarea', placeholder: 'Bu kod ne yapar?' },
  { name: 'code', label: 'Kod', type: 'code', required: true, placeholder: 'Kodu buraya yapıştır' },
  { name: 'tags', label: 'Etiketler', type: 'text', placeholder: 'utility, hook', help: 'Virgülle ayırın' },
  { name: 'sortOrder', label: 'Sıra', type: 'number', placeholder: '0' },
];

export default function AdminKodPage() {
  return <CrudManager endpoint="/api/kod" title="Kod Paylaşımları" subtitle="Kod parçası ekle ve yönet" fields={fields} />;
}
