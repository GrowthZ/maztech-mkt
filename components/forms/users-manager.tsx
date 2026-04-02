'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userSchema } from '@/lib/schemas/entries';
import { apiFetch } from '@/lib/http';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';

type FormValues = z.infer<typeof userSchema>;

type UserItem = Omit<FormValues, 'password'> & { id: string; createdAt: string; updatedAt: string };

export function UsersManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<UserItem | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(userSchema), defaultValues: { fullName: '', username: '', password: '', role: 'CONTENT', isActive: true } });
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: () => apiFetch<{ items: UserItem[] }>('/api/users') });
  const saveMutation = useMutation({ mutationFn: (values: FormValues) => editing ? apiFetch(`/api/users?id=${editing.id}`, { method: 'PUT', body: JSON.stringify(values) }) : apiFetch('/api/users', { method: 'POST', body: JSON.stringify(values) }), onSuccess: () => { setEditing(null); form.reset({ fullName: '', username: '', password: '', role: 'CONTENT', isActive: true }); queryClient.invalidateQueries({ queryKey: ['users'] }); } });
  return <div className="grid gap-6 xl:grid-cols-[380px,1fr]"><Card><CardTitle className="mb-4">{editing ? 'Cập nhật người dùng' : 'Tạo người dùng mới'}</CardTitle><form className="space-y-4" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}><div><Label>Họ tên</Label><Input {...form.register('fullName')} /></div><div><Label>Tài khoản</Label><Input {...form.register('username')} /></div><div><Label>Mật khẩu</Label><Input type="password" {...form.register('password')} placeholder={editing ? 'Bỏ trống nếu giữ nguyên' : 'Nhập mật khẩu'} /></div><div><Label>Vai trò</Label><Select {...form.register('role')}><option value="ADMIN">ADMIN</option><option value="CONTENT">CONTENT</option><option value="ADS">ADS</option><option value="DATA_INPUT">DATA_INPUT</option></Select></div><div><Label>Trạng thái</Label><Select value={String(form.watch('isActive'))} onChange={(event) => form.setValue('isActive', event.target.value === 'true')}><option value="true">Đang hoạt động</option><option value="false">Ngưng hoạt động</option></Select></div><div className="flex gap-3"><Button type="submit" loading={saveMutation.isPending} loadingText="Đang lưu...">{editing ? 'Cập nhật' : 'Tạo user'}</Button>{editing ? <Button type="button" variant="outline" onClick={() => { setEditing(null); form.reset(); }}>Hủy</Button> : null}</div></form></Card><Card><CardTitle className="mb-4">Danh sách người dùng</CardTitle><div className="overflow-x-auto"><Table><THead><TR><TH>Họ tên</TH><TH>Tài khoản</TH><TH>Vai trò</TH><TH>Trạng thái</TH><TH></TH></TR></THead><TBody>{usersQuery.data?.items.map((item) => <TR key={item.id}><TD>{item.fullName}</TD><TD>{item.username}</TD><TD>{item.role}</TD><TD>{item.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}</TD><TD><Button variant="outline" onClick={() => { setEditing(item); form.reset({ fullName: item.fullName, username: item.username, password: '', role: item.role, isActive: item.isActive }); }}>Sửa</Button></TD></TR>)}</TBody></Table></div></Card></div>;
}
