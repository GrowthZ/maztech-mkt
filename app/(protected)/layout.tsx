import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { UserMenu } from '@/components/layout/user-menu';
import { FilterBar } from '@/components/layout/filter-bar';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar user={user} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:block">
                <img src="/maztech-logo.png" alt="Maztech" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Maztech internal</div>
                <div className="text-lg font-semibold text-slate-900">Maztech MKT Hub</div>
              </div>
            </div>
            <UserMenu user={user} />
          </div>
          <FilterBar />
          {children}
        </main>
      </div>
    </div>
  );
}
