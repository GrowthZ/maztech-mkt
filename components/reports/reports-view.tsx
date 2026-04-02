'use client';

import type { ReactNode } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PieChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import { formatBrandLabel, formatDataSourceLabel, formatOwnerLabel, percentWidth } from '@/lib/presentation';
import type { AllReportsData } from '@/types/reports';

const toneMap = {
  blue: { wrapper: 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50', chip: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  violet: { wrapper: 'border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50', chip: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  emerald: { wrapper: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50', chip: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  amber: { wrapper: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50', chip: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  rose: { wrapper: 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50', chip: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500' }
} as const;

export function ReportsView({ data, canExport }: { data: AllReportsData; canExport: boolean }) {
  function download(format: 'xlsx' | 'pdf') {
    const query = new URLSearchParams(window.location.search);
    query.set('format', format);
    window.open(`/api/reports/export?${query.toString()}`, '_blank');
  }

  const sourceTotal = data.source.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#0B1F66] via-[#152C85] to-[#D81920] p-0 text-white shadow-xl">
        <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
              <PieChart className="h-4 w-4" />
              Trung tâm báo cáo phòng Marketing
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Báo cáo không chỉ để xem, mà để quyết định</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Toàn bộ social, SEO, ads và data đầu vào được gom về cùng một màn hình. Màu sắc được chia theo nhóm chức năng để nhìn lướt cũng ra khu nào đang mạnh, khu nào cần chú ý.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:col-span-2">
            <MetricBox title="Tổng data" value={formatNumber(data.data.total)} sub="Theo kỳ lọc hiện tại" />
            <MetricBox title="Tổng chi tiêu" value={formatCurrency(data.ads.spend)} sub="Ads của Thiên" />
            <MetricBox title="Cost / mess" value={formatNumber(Math.round(data.ads.costPerMessage)) + 'đ'} sub="Bình quân toàn kỳ" />
            <MetricBox title="Cost / data" value={formatNumber(Math.round(data.ads.costPerData)) + 'đ'} sub="Bình quân toàn kỳ" />
          </div>
        </div>
      </Card>

      {canExport ? (
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" className="border-[#0B1F66]/15 bg-blue-50 text-[#0B1F66] hover:bg-blue-100" onClick={() => download('xlsx')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button className="bg-gradient-to-r from-[#0B1F66] to-[#D81920] text-white hover:opacity-95" onClick={() => download('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReportSpotlight title="Báo cáo Nam & Đức" sub="Ảnh • Video • Tổng bài • SEO" chip="Hiệu suất content" tone="blue" />
        <ReportSpotlight title="Báo cáo fanpage" sub="Ảnh • Video • Tổng theo fanpage" chip="Kênh social" tone="violet" />
        <ReportSpotlight title="Báo cáo Thiên" sub="Spend • Mess • Data • Cost" chip="Ads performance" tone="emerald" />
        <ReportSpotlight title="Báo cáo Phượng" sub="Data tổng • theo nguồn • theo ngày" chip="Data input" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <SectionTitle title="Tổng hợp dữ liệu theo thương hiệu" sub="Màu sắc tách theo từng chỉ số để nhìn nhanh hơn" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.brandPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="brand" tickFormatter={(value) => formatBrandLabel(String(value))} stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value: number) => formatNumber(Number(value))} labelFormatter={(value) => formatBrandLabel(String(value))} />
                <Legend />
                <Bar dataKey="content" fill="#0B1F66" radius={[6, 6, 0, 0]} name="Social" />
                <Bar dataKey="seo" fill="#152C85" radius={[6, 6, 0, 0]} name="SEO" />
                <Bar dataKey="data" fill="#D81920" radius={[6, 6, 0, 0]} name="Data" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Tỷ trọng nguồn data" sub="Mỗi nguồn có màu riêng để bảng đỡ khô hơn" />
          <div className="space-y-4">
            {data.source.map((row, index) => {
              const tones = ['blue', 'violet', 'amber', 'emerald', 'rose'] as const;
              const tone = toneMap[tones[index % tones.length]];
              return (
                <div key={row.source} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone.chip}`}>{formatDataSourceLabel(row.source)}</span>
                    <span className="text-sm font-semibold text-slate-900">{formatNumber(row.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white">
                    <div className={`${tone.bar} h-2 rounded-full`} style={{ width: percentWidth(row.total, sourceTotal) }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <SectionTitle title="Biến động tổng data theo ngày" sub="Mảng báo cáo dùng màu mềm để xem lâu không mỏi mắt" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="reportArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D81920" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#D81920" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickFormatter={(value) => formatDate(String(value)).slice(0, 5)} stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip labelFormatter={(value) => formatDate(String(value))} formatter={(value: number) => formatNumber(Number(value))} />
                <Area type="monotone" dataKey="total" stroke="#D81920" fill="url(#reportArea)" strokeWidth={3} name="Tổng data" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Chú thích màu báo cáo" sub="Để nhìn vào là hiểu ngay từng nhóm số liệu" />
          <div className="space-y-3 text-sm text-slate-600">
            <LegendBox bg="bg-blue-50" text="text-blue-700" label="Social / nội dung" tone="Xanh dương" />
            <LegendBox bg="bg-violet-50" text="text-violet-700" label="SEO / website" tone="Tím" />
            <LegendBox bg="bg-emerald-50" text="text-emerald-700" label="Ads / chi tiêu" tone="Xanh lá" />
            <LegendBox bg="bg-amber-50" text="text-amber-700" label="Data đầu vào" tone="Cam" />
            <LegendBox bg="bg-rose-50" text="text-rose-700" label="Cảnh báo / bất thường" tone="Đỏ hồng" />
          </div>
        </Card>
      </div>

      <ColorTable
        title="Báo cáo Nam & Đức"
        description="Tổng hợp nhân sự content và SEO trong kỳ lọc"
        headerTone="from-blue-50 to-cyan-50"
        columns={[
          { key: 'ownerName', label: 'Nhân sự', render: (value) => formatOwnerLabel(String(value)) },
          { key: 'image', label: 'Bài ảnh' },
          { key: 'video', label: 'Video' },
          { key: 'total', label: 'Tổng bài đăng' },
          { key: 'seo', label: 'SEO website' }
        ]}
        rows={data.content}
      />

      <ColorTable
        title="Báo cáo fanpage"
        description="Tổng ảnh, video và tổng theo từng fanpage"
        headerTone="from-violet-50 to-fuchsia-50"
        columns={[
          { key: 'fanpage', label: 'Fanpage' },
          { key: 'image', label: 'Ảnh' },
          { key: 'video', label: 'Video' },
          { key: 'total', label: 'Tổng' }
        ]}
        rows={data.fanpage}
      />

      <ColorTable
        title="Báo cáo website SEO"
        description="Phân tách số bài SEO theo website và nhân sự"
        headerTone="from-violet-50 to-indigo-50"
        columns={[
          { key: 'website', label: 'Website' },
          { key: 'ownerName', label: 'Nhân sự', render: (value) => formatOwnerLabel(String(value)) },
          { key: 'quantity', label: 'Số bài' }
        ]}
        rows={data.seo}
      />

      <ColorTable
        title="Báo cáo Thiên theo thương hiệu"
        description="Tổng chi tiêu, mess, data và cost theo thương hiệu"
        headerTone="from-emerald-50 to-teal-50"
        columns={[
          { key: 'brand', label: 'Thương hiệu', render: (value) => formatBrandLabel(String(value)) },
          { key: 'spend', label: 'Tiền chi tiêu', render: (value) => formatCurrency(Number(value)) },
          { key: 'messages', label: 'Số mess', render: (value) => formatNumber(Number(value)) },
          { key: 'costPerMessage', label: 'Cost / mess', render: (value) => `${formatNumber(Math.round(Number(value)))}đ` },
          { key: 'data', label: 'Data', render: (value) => formatNumber(Number(value)) },
          { key: 'costPerData', label: 'Cost / data', render: (value) => `${formatNumber(Math.round(Number(value)))}đ` }
        ]}
        rows={data.adsByBrand}
      />

      <ColorTable
        title="Bảng tổng hợp data theo ngày"
        description="Theo dõi Winhome, Siêu Thị Kệ Giá và tổng data từng ngày"
        headerTone="from-blue-50 via-white to-rose-50"
        columns={[
          { key: 'date', label: 'Ngày', render: (value) => formatDate(String(value)) },
          { key: 'WINHOME', label: 'Winhome', className: 'text-blue-700 font-medium' },
          { key: 'SIEU_THI_KE_GIA', label: 'Siêu Thị Kệ Giá', className: 'text-violet-700 font-medium' },
          { key: 'total', label: 'Tổng', className: 'font-semibold text-slate-900' }
        ]}
        rows={data.dailyRows}
        actionSlot={canExport ? (
          <div className="flex gap-2">
            <button className="rounded-xl border border-[#0B1F66]/15 bg-blue-50 px-3 py-2 text-sm font-medium text-[#0B1F66]" onClick={() => download('xlsx')}>Export Excel</button>
            <button className="rounded-xl bg-gradient-to-r from-[#0B1F66] to-[#D81920] px-3 py-2 text-sm font-medium text-white" onClick={() => download('pdf')}>Export PDF</button>
          </div>
        ) : null}
      />

      <ColorTable
        title="Báo cáo nguồn data"
        description="Tổng hợp nguồn data theo từng thương hiệu"
        headerTone="from-amber-50 to-orange-50"
        columns={[
          { key: 'source', label: 'Nguồn', render: (value) => formatDataSourceLabel(String(value)) },
          { key: 'WINHOME', label: 'Winhome' },
          { key: 'SIEU_THI_KE_GIA', label: 'Siêu Thị Kệ Giá' },
          { key: 'total', label: 'Tổng', className: 'font-semibold text-slate-900' }
        ]}
        rows={data.source}
      />
    </div>
  );
}

function MetricBox({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <div className="text-xs uppercase tracking-wide text-slate-300">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-slate-300">{sub}</div>
    </div>
  );
}

function ReportSpotlight({ title, sub, chip, tone }: { title: string; sub: string; chip: string; tone: keyof typeof toneMap }) {
  const currentTone = toneMap[tone];
  return (
    <Card className={`p-5 shadow-sm ${currentTone.wrapper}`}>
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${currentTone.chip}`}>{chip}</div>
      <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{sub}</div>
      <button className="mt-5 rounded-xl bg-white/80 px-3 py-2 text-sm font-medium text-slate-800 shadow-sm">Xem chi tiết</button>
    </Card>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function LegendBox({ bg, text, label, tone }: { bg: string; text: string; label: string; tone: string }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${bg}`}>
      <span>{label}</span>
      <span className={`font-semibold ${text}`}>{tone}</span>
    </div>
  );
}

function ColorTable({
  title,
  description,
  headerTone,
  columns,
  rows,
  actionSlot
}: {
  title: string;
  description: string;
  headerTone: string;
  columns: Array<{ key: string; label: string; render?: (value: string | number | null | undefined) => string; className?: string }>;
  rows: Array<Record<string, string | number | null | undefined>>;
  actionSlot?: ReactNode;
}) {
  const primaryKeys = ['total', 'data', 'spend', 'quantity', 'messages', 'costPerData', 'costPerMessage'];
  const primaryColumns = columns.filter((column) => primaryKeys.includes(column.key)).slice(0, 3);
  const secondaryColumns = columns.filter((column) => !primaryColumns.some((item) => item.key === column.key));

  const tone = headerTone.includes('blue')
    ? { chip: 'bg-blue-100 text-blue-700', accent: 'bg-blue-500/80' }
    : headerTone.includes('violet') || headerTone.includes('indigo')
      ? { chip: 'bg-violet-100 text-violet-700', accent: 'bg-violet-500/80' }
      : headerTone.includes('emerald') || headerTone.includes('teal')
        ? { chip: 'bg-emerald-100 text-emerald-700', accent: 'bg-emerald-500/80' }
        : headerTone.includes('amber') || headerTone.includes('orange')
          ? { chip: 'bg-amber-100 text-amber-700', accent: 'bg-amber-500/80' }
          : { chip: 'bg-rose-100 text-rose-700', accent: 'bg-rose-500/80' };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r px-4 py-4 sm:px-5 ${headerTone}`}>
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {actionSlot}
      </div>

      <div className="space-y-3 p-3 sm:p-4 md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Không có dữ liệu trong kỳ lọc này.
          </div>
        ) : (
          rows.map((row, index) => (
            <div key={`${title}-mobile-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Bản ghi {index + 1}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone.chip}`}>{title}</span>
              </div>

              <div className={`h-1 w-full ${tone.accent}`} />

              {primaryColumns.length ? (
                <div className="grid grid-cols-2 gap-2 px-4 py-3">
                  {primaryColumns.map((column) => (
                    <div key={`primary-${column.key}`} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                      <div className="text-[11px] font-medium text-slate-500">{column.label}</div>
                      <div className={`mt-1 text-sm font-bold text-slate-900 ${column.className || ''}`}>
                        {column.render ? column.render(row[column.key]) : String(row[column.key] ?? '')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="space-y-2 px-4 pb-4">
                {secondaryColumns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="text-xs font-medium text-slate-500">{column.label}</span>
                    <span className={`text-right text-sm font-semibold text-slate-800 ${column.className || ''}`}>
                      {column.render ? column.render(row[column.key]) : String(row[column.key] ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>Không có dữ liệu trong kỳ lọc này.</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${title}-${index}`} className={index % 2 === 0 ? 'border-t border-slate-100 bg-white' : 'border-t border-slate-100 bg-slate-50/60'}>
                  {columns.map((column) => (
                    <td key={column.key} className={`px-4 py-3 text-slate-700 ${column.className || ''}`}>
                      {column.render ? column.render(row[column.key]) : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
