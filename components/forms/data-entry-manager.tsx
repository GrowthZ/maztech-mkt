'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { dataEntrySchema } from '@/lib/schemas/entries';
import { apiFetch } from '@/lib/http';
import { BRAND_OPTIONS, DATA_SOURCE_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { formatDate } from '@/lib/format';

type FormValues = z.infer<typeof dataEntrySchema>;
type Entry = FormValues & { id: string; createdAt: string; updatedAt: string };

export function DataEntryManager() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Entry | null>(null);
  const queryString = useMemo(() => searchParams.toString() ? `?${searchParams.toString()}` : '', [searchParams]);
  const form = useForm<FormValues>({ resolver: zodResolver(dataEntrySchema), defaultValues: { date: new Date().toISOString().slice(0, 10), brand: 'WINHOME', source: 'FACEBOOK', count: 1 } });
  const listQuery = useQuery({ queryKey: ['data-entries', queryString], queryFn: () => apiFetch<{ items: Entry[] }>(`/api/data-entries${queryString}`) });
  const saveMutation = useMutation({ mutationFn: (values: FormValues) => editing ? apiFetch(`/api/data-entries?id=${editing.id}`, { method: 'PUT', body: JSON.stringify(values) }) : apiFetch('/api/data-entries', { method: 'POST', body: JSON.stringify(values) }), onSuccess: () => { toast.success(editing ? 'Cập nhật thành công' : 'Thêm mới thành công'); setEditing(null); form.reset({ date: new Date().toISOString().slice(0, 10), brand: 'WINHOME', source: 'FACEBOOK', count: 1 }); queryClient.invalidateQueries({ queryKey: ['data-entries'] }); }, onError: (error: Error) => toast.error(error.message) });
  const deleteMutation = useMutation({ mutationFn: (id: string) => apiFetch(`/api/data-entries?id=${id}`, { method: 'DELETE' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['data-entries'] }) });
  return <div className="grid gap-6 xl:grid-cols-[400px,1fr]"><Card><CardTitle className="mb-4">{editing ? 'Sửa data đầu vào' : 'Nhập data đầu vào theo ngày'}</CardTitle><form className="space-y-4" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}><div><Label>Ngày</Label><Input type="date" {...form.register('date')} /></div><div><Label>Thương hiệu</Label><Select {...form.register('brand')}>{BRAND_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></div><div><Label>Nguồn data</Label><Select {...form.register('source')}>{DATA_SOURCE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></div><div><Label>Số data</Label><Input type="number" min={1} {...form.register('count', { valueAsNumber: true })} /></div><p className="text-xs text-red-500">{Object.values(form.formState.errors)[0]?.message as string | undefined}</p><div className="flex gap-3"><Button type="submit" loading={saveMutation.isPending} loadingText="Đang lưu...">{editing ? 'Cập nhật' : 'Thêm mới'}</Button>{editing ? <Button type="button" variant="outline" onClick={() => { setEditing(null); form.reset(); }}>Hủy</Button> : null}</div></form></Card><Card><CardTitle className="mb-4">Danh sách data đầu vào</CardTitle>{listQuery.data?.items.length ? <div className="overflow-x-auto"><Table><THead><TR><TH>Ngày</TH><TH>Thương hiệu</TH><TH>Nguồn</TH><TH>Số data</TH><TH></TH></TR></THead><TBody>{listQuery.data.items.map((item) => <TR key={item.id}><TD>{formatDate(item.date)}</TD><TD>{item.brand}</TD><TD>{item.source}</TD><TD>{item.count}</TD><TD className="space-x-2"><Button variant="outline" onClick={() => { setEditing(item); form.reset({ ...item, date: item.date.slice(0, 10) }); }}>Sửa</Button><Button variant="danger" onClick={() => { if (window.confirm('Xóa bản ghi?')) deleteMutation.mutate(item.id); }}>Xóa</Button></TD></TR>)}</TBody></Table></div> : <EmptyState />}</Card></div>;
}
