'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { JwtUser } from '@/types';

export function UserMenu({ user }: { user: JwtUser }) {
  const router = useRouter();

  async function onLogout() {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      toast.success('Đăng xuất thành công');
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-semibold text-slate-900">{user.fullName}</div>
        <div className="text-xs text-slate-500">{user.username} · {user.role}</div>
      </div>
      <Button variant="outline" onClick={onLogout}>Đăng xuất</Button>
    </div>
  );
}
