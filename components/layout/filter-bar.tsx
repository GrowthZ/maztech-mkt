'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BRAND_OPTIONS, DATA_SOURCE_OPTIONS, OWNER_OPTIONS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const filterPaths = ['/dashboard', '/reports', '/input/content', '/input/seo', '/input/ads', '/input/data'];

export function FilterBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const enabled = useMemo(() => filterPaths.some((path) => pathname.startsWith(path)), [pathname]);
  if (!enabled) return null;

  const mode = searchParams.get('mode') || 'month';

  function update(values: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function reset() {
    router.push(pathname);
  }

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <div>
          <Label>Kỳ báo cáo</Label>
          <Select value={mode} onChange={(event) => update({ mode: event.target.value })}>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
            <option value="year">Năm</option>
            <option value="custom">Khoảng ngày</option>
          </Select>
        </div>

        {mode === 'month' ? (
          <div>
            <Label>Tháng</Label>
            <Input type="month" defaultValue={searchParams.get('month') || new Date().toISOString().slice(0, 7)} onBlur={(event) => update({ month: event.target.value })} />
          </div>
        ) : null}

        {mode === 'quarter' ? (
          <div>
            <Label>Quý</Label>
            <Input placeholder="2026-Q2" defaultValue={searchParams.get('quarter') || ''} onBlur={(event) => update({ quarter: event.target.value })} />
          </div>
        ) : null}

        {mode === 'year' ? (
          <div>
            <Label>Năm</Label>
            <Input placeholder="2026" defaultValue={searchParams.get('year') || ''} onBlur={(event) => update({ year: event.target.value })} />
          </div>
        ) : null}

        {mode === 'custom' ? (
          <>
            <div>
              <Label>Từ ngày</Label>
              <Input type="date" defaultValue={searchParams.get('from') || ''} onBlur={(event) => update({ from: event.target.value })} />
            </div>
            <div>
              <Label>Đến ngày</Label>
              <Input type="date" defaultValue={searchParams.get('to') || ''} onBlur={(event) => update({ to: event.target.value })} />
            </div>
          </>
        ) : null}

        <div>
          <Label>Thương hiệu</Label>
          <Select defaultValue={searchParams.get('brand') || ''} onChange={(event) => update({ brand: event.target.value })}>
            <option value="">Tất cả</option>
            {BRAND_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Nhân sự</Label>
          <Select defaultValue={searchParams.get('owner') || ''} onChange={(event) => update({ owner: event.target.value })}>
            <option value="">Tất cả</option>
            {OWNER_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Nguồn data</Label>
          <Select defaultValue={searchParams.get('source') || ''} onChange={(event) => update({ source: event.target.value })}>
            <option value="">Tất cả</option>
            {DATA_SOURCE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" className="border-[#0B1F66]/15 text-[#0B1F66] hover:bg-blue-50" onClick={reset}>Xóa bộ lọc</Button>
      </div>
    </div>
  );
}
