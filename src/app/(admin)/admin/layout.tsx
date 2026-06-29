import { AdminShell } from '@/components/layout/AdminShell';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Yönetim Paneli', template: '%s | Yönetim' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR'];
  if (!session?.user || !allowedRoles.includes(role || '')) {
    redirect('/giris');
  }

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? '',
    role: role ?? '',
  };

  return <AdminShell user={user}>{children}</AdminShell>;
}
