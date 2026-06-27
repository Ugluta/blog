import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; href?: string };

export function PageHeader({
  title, breadcrumb = [], action,
}: {
  title: string;
  breadcrumb?: Crumb[];
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        {action}
      </div>
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/admin" className="hover:text-blue-600">Ana Sayfa</Link>
        {breadcrumb.map((c) => (
          <span key={c.label} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5" />
            {c.href ? (
              <Link href={c.href} className="hover:text-blue-600">{c.label}</Link>
            ) : (
              <span className="text-gray-600">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
