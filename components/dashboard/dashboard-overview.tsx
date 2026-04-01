'use client';

import { Activity, ArrowUpRight, Building2, CalendarDays, CircleDollarSign, Database, FileText, Megaphone, Target, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import { formatBrandLabel, formatDataSourceLabel, formatModuleLabel, percentWidth } from '@/lib/presentation';
import type { ActivityRow, BrandPerformanceRow, SourceRow } from '@/types/reports';

function kpiData(summary: {
  nam: { total: number; seo: number };
  duc: { total: number; seo: number };
  thien: { spend: number; messages: number; data: number; costPerData: number };
  phuong: { total: number; winhome: number; sieuThiKeGia: number };
}) {
  return [
    { title: 'Tổng bài social', value: formatNumber(summary.nam.total + summary.duc.total), icon: Activity },
    { title: 'Bài SEO', value: formatNumber(summary.nam.seo + summary.duc.seo), icon: FileText },
    { title: 'Chi tiêu ads', value: formatCurrency(summary.thien.spend), icon: CircleDollarSign },
    { title: 'Tổng data vào', value: formatNumber(summary.phuong.total), icon: Database }
  ];
}

function teamRows(summary: {
  nam: { total: number; image: number; video: number; seo: number };
  duc: { total: number; image: number; video: number; seo: number };
  thien: { data: number };
  phuong: { total: number };
}) {
  return [
    { member: 'Nam', social: summary.nam.total, image: summary.nam.image, video: summary.nam.video, seo: summary.nam.seo, total: summary.nam.total + summary.nam.seo },
    { member: 'Đức', social: summary.duc.total, image: summary.duc.image, video: summary.duc.video, seo: summary.duc.seo, total: summary.duc.total + summary.duc.seo },
    { member: 'Thiên', social: '-', image: '-', video: '-', seo: '-', total: `${formatNumber(summary.thien.data)} data ads` },
    { member: 'Phượng', social: '-', image: '-', video: '-', seo: '-', total: `${formatNumber(summary.phuong.total)} data vào` }
  ];
}

export function DashboardOverview({
  summary,
  trend,
  fanpage,
  source,
  brandPerformance,
  activity
}: {
  summary: {
    nam: { total: number; image: number; video: number; seo: number };
    duc: { total: number; image: number; video: number; seo: number };
    thien: { spend: number; messages: number; data: number; costPerMessage: number; costPerData: number };
    phuong: { total: number; winhome: number; sieuThiKeGia: number };
  };
  trend: Array<{ date: string; WINHOME: number; SIEU_THI_KE_GIA: number; total: number }>;
  fanpage: Array<{ fanpage: string; image: number; video: number; total: number }>;
  source: SourceRow[];
  brandPerformance: BrandPerformanceRow[];
  activity: ActivityRow[];
}) {
  const sourceTotal = source.reduce((sum, item) => sum + item.total, 0);
  const team = teamRows(summary);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#0B1F66] via-[#152C85] to-[#D81920] p-0 text-white shadow-xl">
        <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
              <CalendarDays className="h-4 w-4" />
              Bộ lọc đang áp dụng cho toàn dashboard
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Bảng điều hành Marketing nội bộ</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Ưu tiên nhìn nhanh hiệu suất social, SEO, ads và data đầu vào của Winhome và Siêu Thị Kệ Giá. Những số nổi bật và cảnh báo đều bám theo bộ lọc đang chọn.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {kpiData(summary).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{item.title}</span>
                    </div>
                    <div className="mt-3 text-2xl font-bold text-white">{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Hiệu suất theo thương hiệu</div>
                  <div className="mt-1 text-lg font-semibold">Tỷ trọng data đầu vào</div>
                </div>
                <Building2 className="h-5 w-5 text-slate-300" />
              </div>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span>Winhome</span>
                    <span className="font-semibold">{percentWidth(summary.phuong.winhome, summary.phuong.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-white" style={{ width: percentWidth(summary.phuong.winhome, summary.phuong.total) }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span>Siêu Thị Kệ Giá</span>
                    <span className="font-semibold">{percentWidth(summary.phuong.sieuThiKeGia, summary.phuong.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-slate-300" style={{ width: percentWidth(summary.phuong.sieuThiKeGia, summary.phuong.total) }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Cảnh báo nhanh</div>
                  <div className="mt-1 text-lg font-semibold">Điểm cần chú ý</div>
                </div>
                <Target className="h-5 w-5 text-slate-300" />
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="rounded-xl bg-white/5 p-3">Cost/data bình quân hiện tại là {formatNumber(Math.round(summary.thien.costPerData))}đ.</div>
                <div className="rounded-xl bg-white/5 p-3">Tổng mess ads đạt {formatNumber(summary.thien.messages)} và data ads đạt {formatNumber(summary.thien.data)}.</div>
                <div className="rounded-xl bg-white/5 p-3">Nam đang có tổng social + SEO là {formatNumber(summary.nam.total + summary.nam.seo)}, Đức là {formatNumber(summary.duc.total + summary.duc.seo)}.</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Nam', value: formatNumber(summary.nam.total + summary.nam.seo), sub: `${formatNumber(summary.nam.total)} social • ${formatNumber(summary.nam.seo)} SEO`, delta: `${formatNumber(summary.nam.image)} ảnh`, icon: Megaphone },
          { title: 'Đức', value: formatNumber(summary.duc.total + summary.duc.seo), sub: `${formatNumber(summary.duc.total)} social • ${formatNumber(summary.duc.seo)} SEO`, delta: `${formatNumber(summary.duc.video)} video`, icon: FileText },
          { title: 'Thiên', value: formatCurrency(summary.thien.spend), sub: `${formatNumber(summary.thien.messages)} mess • ${formatNumber(summary.thien.data)} data`, delta: `${formatNumber(Math.round(summary.thien.costPerData))}đ/data`, icon: TrendingUp },
          { title: 'Phượng', value: formatNumber(summary.phuong.total), sub: `Winhome ${formatNumber(summary.phuong.winhome)} • Kệ Giá ${formatNumber(summary.phuong.sieuThiKeGia)}`, delta: percentWidth(summary.phuong.winhome, summary.phuong.total), icon: Database }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{card.title}</div>
                  <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{card.value}</div>
                </div>
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">{card.sub}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  <ArrowUpRight className="h-3 w-3" />
                  {card.delta}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <SectionTitle title="Biến động data theo ngày" sub="So sánh trực tiếp Winhome và Siêu Thị Kệ Giá trong cùng kỳ" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickFormatter={(value) => formatDate(String(value)).slice(0, 5)} stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip labelFormatter={(value) => formatDate(String(value))} />
                <Legend />
                <Line type="monotone" dataKey="WINHOME" name="Winhome" stroke="#0B1F66" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SIEU_THI_KE_GIA" name="Siêu Thị Kệ Giá" stroke="#64748b" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Nguồn data đầu vào" sub="Nhìn nhanh tỷ trọng và tổng số của từng nguồn" />
          <div className="space-y-4">
            {source.map((row) => (
              <div key={row.source}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{formatDataSourceLabel(row.source)}</span>
                  <span className="font-medium text-slate-900">{formatNumber(row.total)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#0B1F66]" style={{ width: percentWidth(row.total, sourceTotal) }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <SectionTitle title="Báo cáo fanpage" sub="Tổng ảnh, video và tổng bài đăng theo fanpage" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fanpage.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="fanpage" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="image" radius={[6, 6, 0, 0]} fill="#0B1F66" name="Ảnh" />
                <Bar dataKey="video" radius={[6, 6, 0, 0]} fill="#D81920" name="Video" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Nhật ký hoạt động" sub="Cập nhật gần nhất từ audit log trong kỳ lọc" />
          <div className="space-y-3">
            {activity.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Chưa có hoạt động trong kỳ đang lọc.</div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900">{item.user}</div>
                    <div className="text-xs text-slate-500">{formatDate(item.time)}</div>
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    {item.action} · {formatModuleLabel(item.module)} · {item.recordId}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="font-semibold text-slate-900">Hiệu suất theo thương hiệu</h3>
            <p className="mt-1 text-sm text-slate-500">Tổng hợp social, SEO, data đầu vào và chi tiêu ads</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Thương hiệu</th>
                  <th className="px-4 py-3 font-medium">Social</th>
                  <th className="px-4 py-3 font-medium">SEO</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Ads spend</th>
                </tr>
              </thead>
              <tbody>
                {brandPerformance.map((row) => (
                  <tr key={row.brand} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{formatBrandLabel(row.brand)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatNumber(row.content)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatNumber(row.seo)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatNumber(row.data)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatCurrency(row.spend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="font-semibold text-slate-900">Sản lượng theo nhân sự</h3>
            <p className="mt-1 text-sm text-slate-500">Tách rõ social, ảnh, video, SEO và tổng đầu ra</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Nhân sự</th>
                  <th className="px-4 py-3 font-medium">Social</th>
                  <th className="px-4 py-3 font-medium">Ảnh</th>
                  <th className="px-4 py-3 font-medium">Video</th>
                  <th className="px-4 py-3 font-medium">SEO</th>
                  <th className="px-4 py-3 font-medium">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {team.map((row) => (
                  <tr key={String(row.member)} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.member}</td>
                    <td className="px-4 py-3 text-slate-700">{String(row.social)}</td>
                    <td className="px-4 py-3 text-slate-700">{String(row.image)}</td>
                    <td className="px-4 py-3 text-slate-700">{String(row.video)}</td>
                    <td className="px-4 py-3 text-slate-700">{String(row.seo)}</td>
                    <td className="px-4 py-3 text-slate-900">{String(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
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
