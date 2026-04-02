'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X, BarChart3, ClipboardList, FileBarChart2, FilePenLine, Megaphone, NotebookPen, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { logoutAndClearClientState } from '@/lib/client/logout';
import type { ModuleName } from '@/lib/permissions';
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  async function onLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logoutAndClearClientState();
      queryClient.clear();
      toast.success('Đăng xuất thành công');
    } catch {
      toast.error('Đăng xuất thất bại, vui lòng thử lại');
    } finally {
      closeDrawer();
      router.replace('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
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

  const visibleLinks = useMemo(() => {
    if (user.role === 'ADMIN') return links;
    if (user.role === 'CONTENT') return links.filter((item) => !item.module || item.module === 'content' || item.module === 'seo');
    if (user.role === 'ADS') return links.filter((item) => !item.module || item.module === 'ads');
    if (user.role === 'DATA_INPUT') return links.filter((item) => !item.module || item.module === 'data');
    return links.filter((item) => !item.module);
  }, [user.role]);

  const drawer = mounted ? (
    <div className="fixed inset-0 z-[9999] lg:hidden">
      <div
        className={cn(
          'absolute inset-0 z-[10000] bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={closeDrawer}
      />

      <aside className={cn(
        'absolute left-0 top-0 z-[10001] flex h-full w-[280px] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[320px]',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col border-b border-slate-100 bg-white px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600/70">Maztech</span>
              <span className="text-xl font-black tracking-tight text-[#0B1F66]">MKT HUB</span>
            </div>
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={closeDrawer}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1F66] text-xs font-bold text-white shadow-lg shadow-blue-900/20">
              {user.fullName?.charAt(0) || user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900">{user.fullName || user.username}</div>
              <div className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400">{user.role}</div>
            </div>
          </div>
        </div>

        <nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <div className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Điều hướng</div>
          {visibleLinks.length ? visibleLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeDrawer}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-blue-50 text-[#0B1F66] ring-1 ring-blue-100/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 transition-colors',
                  active ? 'text-[#0B1F66]' : 'text-slate-400 group-hover:text-slate-600'
                )} />
                {item.label}
                {active && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-[#0B1F66]" />}
              </Link>
            );
          }) : (
            <div className="mx-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs font-medium text-slate-400">
              Không có quyền truy cập
            </div>
          )}

          {user.role === 'ADMIN' && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Quản trị</div>
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
                        'group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200',
                        active
                          ? 'bg-blue-50 text-[#0B1F66] ring-1 ring-blue-100/50'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <Icon className={cn(
                        'h-5 w-5 transition-colors',
                        active ? 'text-[#0B1F66]' : 'text-slate-400 group-hover:text-slate-600'
                      )} />
                      {item.label}
                      {active && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-[#0B1F66]" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-slate-100 bg-white p-6">
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
    </div>
  ) : null;

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

      {typeof document !== 'undefined' ? createPortal(drawer, document.body) : null}
    </>
  );
}
