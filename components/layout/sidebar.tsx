'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ClipboardList, FileBarChart2, FilePenLine, Megaphone, NotebookPen, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { canAccessModule, type ModuleName } from '@/lib/permissions';
import type { JwtUser } from '@/types';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3, module: null },
  { href: '/input/content', label: 'Nhập social', icon: FilePenLine, module: 'content' as ModuleName },
  { href: '/input/seo', label: 'Nhập SEO', icon: NotebookPen, module: 'seo' as ModuleName },
  { href: '/input/ads', label: 'Nhập Ads', icon: Megaphone, module: 'ads' as ModuleName },
  { href: '/input/data', label: 'Nhập data', icon: ClipboardList, module: 'data' as ModuleName },
  { href: '/reports', label: 'Báo cáo', icon: FileBarChart2, module: null }
] as const;

export function Sidebar({ user }: { user: JwtUser }) {
  const pathname = usePathname();
  const adminLinks = [
    { href: '/settings/users', label: 'Người dùng', icon: Users },
    { href: '/audit-logs', label: 'Audit log', icon: Shield }
  ] as const;

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
      <nav className="space-y-1">
        {links.filter((item) => !item.module || canAccessModule(user, item.module)).map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900',
                active && 'bg-blue-50 text-[#0B1F66]'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user.role === 'ADMIN' ? (
        <div className="mt-8 border-t pt-6">
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quản trị</div>
          <div className="space-y-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900',
                    active && 'bg-blue-50 text-[#0B1F66]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
