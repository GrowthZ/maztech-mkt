'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const queryKey = searchParams.toString();

  const enabled = useMemo(() => filterPaths.some((path) => pathname.startsWith(path)), [pathname]);

  const mode = searchParams.get('mode') || 'month';
  const defaultMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [draft, setDraft] = useState(() => ({
    mode,
    month: searchParams.get('month') || defaultMonth,
    quarter: searchParams.get('quarter') || '',
    year: searchParams.get('year') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    brand: searchParams.get('brand') || '',
    owner: searchParams.get('owner') || '',
    source: searchParams.get('source') || ''
  }));

  useEffect(() => {
    const nextDraft = {
      mode,
      month: searchParams.get('month') || defaultMonth,
      quarter: searchParams.get('quarter') || '',
      year: searchParams.get('year') || '',
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      brand: searchParams.get('brand') || '',
      owner: searchParams.get('owner') || '',
      source: searchParams.get('source') || ''
    };

    setDraft((current) => {
      if (
        current.mode === nextDraft.mode
        && current.month === nextDraft.month
        && current.quarter === nextDraft.quarter
        && current.year === nextDraft.year
        && current.from === nextDraft.from
        && current.to === nextDraft.to
        && current.brand === nextDraft.brand
        && current.owner === nextDraft.owner
        && current.source === nextDraft.source
      ) {
        return current;
      }

      return nextDraft;
    });
  }, [defaultMonth, mode, queryKey]);

  function apply() {
    const params = new URLSearchParams();

    if (draft.mode !== 'month') params.set('mode', draft.mode);

    if (draft.mode === 'month' && draft.month) params.set('month', draft.month);
    if (draft.mode === 'quarter' && draft.quarter) params.set('quarter', draft.quarter);
    if (draft.mode === 'year' && draft.year) params.set('year', draft.year);
    if (draft.mode === 'custom') {
      if (draft.from) params.set('from', draft.from);
      if (draft.to) params.set('to', draft.to);
    }

    if (draft.brand) params.set('brand', draft.brand);
    if (draft.owner) params.set('owner', draft.owner);
    if (draft.source) params.set('source', draft.source);

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  function reset() {
    setDraft({
      mode: 'month',
      month: defaultMonth,
      quarter: '',
      year: '',
      from: '',
      to: '',
      brand: '',
      owner: '',
      source: ''
    });

    if (!searchParams.toString()) return;
    router.replace(pathname);
  }

  if (!enabled) return null;

  return (
    <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft sm:mb-6 sm:p-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-7">
        <div>
          <Label>Kỳ báo cáo</Label>
          <Select
            value={draft.mode}
            onChange={(event) => setDraft((current) => ({ ...current, mode: event.target.value as typeof current.mode }))}
          >
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
            <option value="year">Năm</option>
            <option value="custom">Khoảng ngày</option>
          </Select>
        </div>

        {draft.mode === 'month' ? (
          <div>
            <Label>Tháng</Label>
            <Input type="month" value={draft.month} onChange={(event) => setDraft((current) => ({ ...current, month: event.target.value }))} />
          </div>
        ) : null}

        {draft.mode === 'quarter' ? (
          <div>
            <Label>Quý</Label>
            <Input placeholder="2026-Q2" value={draft.quarter} onChange={(event) => setDraft((current) => ({ ...current, quarter: event.target.value }))} />
          </div>
        ) : null}

        {draft.mode === 'year' ? (
          <div>
            <Label>Năm</Label>
            <Input placeholder="2026" value={draft.year} onChange={(event) => setDraft((current) => ({ ...current, year: event.target.value }))} />
          </div>
        ) : null}

        {draft.mode === 'custom' ? (
          <>
            <div>
              <Label>Từ ngày</Label>
              <Input type="date" value={draft.from} onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} />
            </div>
            <div>
              <Label>Đến ngày</Label>
              <Input type="date" value={draft.to} onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} />
            </div>
          </>
        ) : null}

        <div>
          <Label>Thương hiệu</Label>
          <Select value={draft.brand} onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))}>
            <option value="">Tất cả</option>
            {BRAND_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Nhân sự</Label>
          <Select value={draft.owner} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))}>
            <option value="">Tất cả</option>
            {OWNER_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Nguồn data</Label>
          <Select value={draft.source} onChange={(event) => setDraft((current) => ({ ...current, source: event.target.value }))}>
            <option value="">Tất cả</option>
            {DATA_SOURCE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
        <Button variant="outline" className="w-full border-[#0B1F66]/15 text-[#0B1F66] hover:bg-blue-50 sm:w-auto" onClick={reset}>Xóa bộ lọc</Button>
        <Button className="w-full bg-gradient-to-r from-[#0B1F66] to-[#D81920] text-white hover:opacity-95 sm:w-auto" onClick={apply}>Áp dụng</Button>
      </div>
    </div>
  );
}
