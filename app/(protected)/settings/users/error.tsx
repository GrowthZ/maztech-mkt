'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function UsersPageError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Users page error:', error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
      <h2 className="text-lg font-semibold">Không thể mở trang Người dùng</h2>
      <p className="mt-2 text-sm">
        Môi trường production vừa gặp lỗi runtime. Bạn có thể tải lại trang, nếu vẫn lỗi hãy kiểm tra biến môi trường và quyền Admin.
      </p>
      <div className="mt-4">
        <Button onClick={reset}>Thử lại</Button>
      </div>
    </div>
  );
}
