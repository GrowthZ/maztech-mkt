'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { contentEntrySchema } from '@/lib/schemas/entries';
import { apiFetch } from '@/lib/http';
import { BRAND_OPTIONS, CONTENT_TYPE_OPTIONS, FANPAGE_OPTIONS, OWNER_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { formatDate } from '@/lib/format';
import { formatBrandLabel, formatContentTypeLabel, formatOwnerLabel } from '@/lib/presentation';
import { ownerNameFromIdentity } from '@/lib/permissions';

type FormValues = z.infer<typeof contentEntrySchema>;
type Entry = FormValues & { id: string; createdAt: string; updatedAt: string };
type AuthMe = { user: { username: string; fullName: string; role: 'ADMIN' | 'CONTENT' | 'ADS' | 'DATA_INPUT' } };

const defaultValues: FormValues = {
  date: new Date().toISOString().slice(0, 10),
  ownerName: 'NAM',
  brand: 'WINHOME',
  fanpage: FANPAGE_OPTIONS[0].value,
  contentType: 'IMAGE',
  quantity: 1
};

export function ContentEntryManager() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Entry | null>(null);

  const queryString = useMemo(() => {
    const value = searchParams.toString();
    return value ? `?${value}` : '';
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(contentEntrySchema),
    defaultValues
  });

  const meQuery = useQuery({ queryKey: ['auth-me'], queryFn: () => apiFetch<AuthMe>('/api/auth/me') });

  const resolvedOwner = useMemo(() => {
    const me = meQuery.data?.user;
    return ownerNameFromIdentity(me?.username, me?.fullName);
  }, [meQuery.data]);

  const ownerOptions = useMemo(() => {
    if (meQuery.data?.user.role === 'ADMIN' || !resolvedOwner) return OWNER_OPTIONS;
    return OWNER_OPTIONS.filter((item) => item.value === resolvedOwner);
  }, [meQuery.data, resolvedOwner]);

  useEffect(() => {
    if (!editing && resolvedOwner && form.getValues('ownerName') !== resolvedOwner) {
      form.setValue('ownerName', resolvedOwner);
    }
  }, [editing, form, resolvedOwner]);

  const listQuery = useQuery({
    queryKey: ['content-entries', queryString],
    queryFn: () => apiFetch<{ items: Entry[] }>(`/api/content-entries${queryString}`)
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (editing) {
        return apiFetch(`/api/content-entries?id=${editing.id}`, { method: 'PUT', body: JSON.stringify(values) });
      }
      return apiFetch('/api/content-entries', { method: 'POST', body: JSON.stringify(values) });
    },
    onSuccess: () => {
      toast.success(editing ? 'Cập nhật thành công' : 'Thêm mới thành công');
      setEditing(null);
      form.reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ['content-entries'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/content-entries?id=${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['content-entries'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  function startEdit(item: Entry) {
    setEditing(item);
    form.reset({ ...item, date: item.date.slice(0, 10) });
  }

  function remove(id: string) {
    if (window.confirm('Bạn chắc chắn muốn xóa bản ghi này?')) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
      <Card>
        <CardTitle className="mb-4">{editing ? 'Sửa bản ghi social' : 'Nhập social theo ngày'}</CardTitle>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Nguyên tắc nhập liệu</div>
            <div className="mt-2 text-sm font-medium text-slate-900">Khóa danh mục bằng select</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">Nhân sự, thương hiệu, fanpage và loại bài đều chọn sẵn để dữ liệu không bị lệch.</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Mục tiêu</div>
            <div className="mt-2 text-sm font-medium text-slate-900">Báo cáo sạch và đồng bộ</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">Hạn chế sai tên fanpage, sai thương hiệu hoặc nhập lệch loại bài.</div>
          </div>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
          <div><Label>Ngày</Label><Input type="date" {...form.register('date')} /></div>
          <div><Label>Nhân sự</Label><Select {...form.register('ownerName')}>{ownerOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></div>
          <div><Label>Thương hiệu</Label><Select {...form.register('brand')}>{BRAND_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></div>
          <div><Label>Fanpage</Label><Select {...form.register('fanpage')}>{FANPAGE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></div>
          <div><Label>Loại bài</Label><Select {...form.register('contentType')}>{CONTENT_TYPE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></div>
          <div><Label>Số lượng</Label><Input type="number" min={1} {...form.register('quantity', { valueAsNumber: true })} /></div>
          <p className="text-xs text-red-500">{Object.values(form.formState.errors)[0]?.message as string | undefined}</p>
          <div className="flex gap-3">
            <Button type="submit" loading={saveMutation.isPending} loadingText="Đang lưu...">{editing ? 'Cập nhật' : 'Thêm mới'}</Button>
            {editing ? <Button type="button" variant="outline" onClick={() => { setEditing(null); form.reset(defaultValues); }}>Hủy</Button> : null}
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle className="mb-4">Danh sách social</CardTitle>
        {listQuery.isLoading ? <div className="text-sm text-slate-500">Đang tải...</div> : null}
        {!listQuery.isLoading && (listQuery.data?.items.length || 0) === 0 ? <EmptyState /> : null}
        {listQuery.data?.items.length ? (
          <div className="overflow-x-auto">
            <Table>
              <THead><TR><TH>Ngày</TH><TH>Nhân sự</TH><TH>Thương hiệu</TH><TH>Fanpage</TH><TH>Loại</TH><TH>Số lượng</TH><TH></TH></TR></THead>
              <TBody>
                {listQuery.data.items.map((item, index) => (
                  <TR key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <TD>{formatDate(item.date)}</TD>
                    <TD>{formatOwnerLabel(item.ownerName)}</TD>
                    <TD>{formatBrandLabel(item.brand)}</TD>
                    <TD>{item.fanpage}</TD>
                    <TD>{formatContentTypeLabel(item.contentType)}</TD>
                    <TD>{item.quantity}</TD>
                    <TD className="space-x-2">
                      <Button variant="outline" onClick={() => startEdit(item)}>Sửa</Button>
                      <Button variant="danger" onClick={() => remove(item.id)}>Xóa</Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
