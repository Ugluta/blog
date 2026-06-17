import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Yönetim Paneli', template: '%s | Yönetim' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    redirect('/giris');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
