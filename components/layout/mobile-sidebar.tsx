'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BarChart3, ClipboardList, FileBarChart2, FilePenLine, Megaphone, NotebookPen, Shield, Users } from 'lucide-react';
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

export function MobileSidebar({ user }: { user: JwtUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDrawer() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  }

  function closeDrawer() {
    setOpen(false);
    closeTimeoutRef.current = setTimeout(() => {
      setMounted(false);
      closeTimeoutRef.current = null;
    }, 220);
  }

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mounted]);

  useEffect(() => () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const adminLinks = useMemo(() => ([
    { href: '/settings/users', label: 'Người dùng', icon: Users },
    { href: '/audit-logs', label: 'Audit log', icon: Shield }
  ]), []);

  const visibleLinks = useMemo(() => links.filter((item) => !item.module || canAccessModule(user, item.module)), [user]);

  return (
    <>
      <button
        type="button"
        aria-label="Mở menu"
        aria-expanded={open}
        onClick={openDrawer}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className={cn(
              'absolute inset-0 bg-slate-900/35 backdrop-blur-[1px] transition-opacity duration-200',
              open ? 'opacity-100' : 'opacity-0'
            )}
            onClick={closeDrawer}
          />

          <aside className={cn(
            'absolute left-0 top-0 flex h-full w-[82vw] max-w-xs flex-col border-r border-slate-200 bg-white p-4 shadow-2xl transition-transform duration-200 ease-out',
            open ? 'translate-x-0' : '-translate-x-full'
          )}>
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Maztech MKT Hub</div>
                <div className="text-sm font-semibold text-slate-900">Menu điều hướng</div>
              </div>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={closeDrawer}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 overflow-y-auto pb-4">
              {visibleLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeDrawer}
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
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quản trị</div>
                <div className="space-y-1">
                  {adminLinks.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeDrawer}
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
        </div>
      ) : null}
    </>
  );
}
