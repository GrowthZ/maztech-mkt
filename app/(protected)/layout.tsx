import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { UserMenu } from '@/components/layout/user-menu';
import { FilterBar } from '@/components/layout/filter-bar';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar user={user} />
        <main className="flex-1 p-3 sm:p-4 lg:p-8">
          <div className="sticky top-2 z-[60] mb-4 flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/95 px-4 py-3 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:mb-6 sm:px-5 lg:static lg:bg-white lg:backdrop-blur-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden">
                <MobileSidebar user={user} />
              </div>
              <div className="hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:block">
                <img src="/maztech-logo.png" alt="Maztech" className="h-10 w-auto object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:text-xs">Maztech internal</div>
                <div className="truncate text-base font-semibold text-slate-900 sm:text-lg">Maztech MKT Hub</div>
              </div>
            </div>
            <div className="shrink-0">
              <UserMenu user={user} />
            </div>
          </div>
          <FilterBar />
          {children}
        </main>
      </div>
    </div>
  );
}
