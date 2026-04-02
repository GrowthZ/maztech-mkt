'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { logoutAndClearClientState } from '@/lib/client/logout';
import type { JwtUser } from '@/types';

export function UserMenu({ user }: { user: JwtUser }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      router.replace('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden text-right sm:block">
        <div className="text-sm font-semibold text-slate-900">{user.fullName}</div>
        <div className="text-xs text-slate-500">{user.username} · {user.role}</div>
      </div>
      <Button variant="outline" className="px-3 py-2 text-xs sm:text-sm" onClick={onLogout} loading={isLoggingOut} loadingText="Đang đăng xuất...">Đăng xuất</Button>
    </div>
  );
}
