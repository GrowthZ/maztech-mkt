'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/schemas/auth';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  });

  async function onSubmit(values: LoginForm) {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      toast.success('Đăng nhập thành công');
      router.replace('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200 p-8">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <img src="/maztech-logo.png" alt="Maztech" className="h-12 w-auto object-contain" />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#0B1F66]">Maztech Group</div>
          </div>
          <CardTitle className="text-3xl">Đăng nhập MKT Hub</CardTitle>
          <CardDescription className="mt-2">Hệ thống quản trị công việc và báo cáo Marketing nội bộ.</CardDescription>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label>Tài khoản</Label>
            <Input {...form.register('username')} placeholder="Nhập tài khoản" />
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.username?.message}</p>
          </div>
          <div>
            <Label>Mật khẩu</Label>
            <Input type="password" {...form.register('password')} placeholder="Nhập mật khẩu" />
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.password?.message}</p>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-[#0B1F66] to-[#D81920] text-white hover:opacity-95" loading={loading} loadingText="Đang đăng nhập...">Đăng nhập</Button>
        </form>
      </Card>
    </div>
  );
}
