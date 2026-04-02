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
      <div className="mb-8 rounded-3xl border border-blue-950/10 bg-gradient-to-br from-[#0B1F66] via-[#152C85] to-[#D81920] p-5 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <img src="/maztech-logo.png" alt="Maztech" className="h-14 w-auto object-contain" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Maztech Group</div>
            <div className="mt-1 text-2xl font-bold">MKT Hub</div>
            <div className="mt-1 text-sm text-blue-50/90">Hệ thống quản trị nội bộ cho Winhome và Siêu Thị Kệ Giá</div>
          </div>
        </div>
      </div>

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
