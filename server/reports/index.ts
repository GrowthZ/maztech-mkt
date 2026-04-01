import { prisma } from '@/lib/prisma';
import type { JwtUser, SearchParams } from '@/types';
import type { ActivityRow, AllReportsData, BrandPerformanceRow, ContentSummaryRow, DashboardSummaryData } from '@/types/reports';
import { resolveFilters, type ResolvedFilters } from '@/lib/filters';
import { toNumber } from '@/lib/utils';
import { getBrandFromWebsite } from '@/lib/presentation';
import { scopedAdsWhere, scopedContentWhere, scopedDataWhere, scopedSeoWhere } from '@/server/services/common';

function safeRatio(numerator: number, denominator: number) {
  return denominator > 0 ? numerator / denominator : 0;
}

export async function contentSummaryByOwner(filters: ResolvedFilters, user: JwtUser): Promise<ContentSummaryRow[]> {
  const [contentEntries, seoEntries] = await Promise.all([
    prisma.contentEntry.findMany({ where: scopedContentWhere(filters, user) }),
    prisma.seoEntry.findMany({ where: scopedSeoWhere(filters, user) })
  ]);

  const base: Record<'NAM' | 'DUC', ContentSummaryRow> = {
    NAM: { ownerName: 'NAM', image: 0, video: 0, total: 0, seo: 0 },
    DUC: { ownerName: 'DUC', image: 0, video: 0, total: 0, seo: 0 }
  };

  for (const item of contentEntries) {
    base[item.ownerName].total += item.quantity;
    if (item.contentType === 'IMAGE') base[item.ownerName].image += item.quantity;
    if (item.contentType === 'VIDEO') base[item.ownerName].video += item.quantity;
  }

  for (const item of seoEntries) {
    base[item.ownerName].seo += item.quantity;
  }

  return Object.values(base);
}

export async function fanpageBreakdown(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.contentEntry.findMany({ where: scopedContentWhere(filters, user) });
  const grouped = new Map<string, { fanpage: string; image: number; video: number; total: number }>();

  for (const item of items) {
    const current = grouped.get(item.fanpage) || { fanpage: item.fanpage, image: 0, video: 0, total: 0 };
    current.total += item.quantity;
    if (item.contentType === 'IMAGE') current.image += item.quantity;
    if (item.contentType === 'VIDEO') current.video += item.quantity;
    grouped.set(item.fanpage, current);
  }

  return Array.from(grouped.values()).sort((a, b) => b.total - a.total);
}

export async function seoBreakdown(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.seoEntry.findMany({ where: scopedSeoWhere(filters, user) });
  const grouped = new Map<string, { website: string; ownerName: 'NAM' | 'DUC'; quantity: number }>();

  for (const item of items) {
    const key = `${item.website}-${item.ownerName}`;
    const current = grouped.get(key) || { website: item.website, ownerName: item.ownerName, quantity: 0 };
    current.quantity += item.quantity;
    grouped.set(key, current);
  }

  return Array.from(grouped.values()).sort((a, b) => b.quantity - a.quantity);
}

export async function adsTotals(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.adsEntry.findMany({ where: scopedAdsWhere(filters, user) });
  const spend = items.reduce((sum, item) => sum + toNumber(item.spend), 0);
  const messages = items.reduce((sum, item) => sum + item.messages, 0);
  const data = items.reduce((sum, item) => sum + item.data, 0);
  return {
    spend,
    messages,
    data,
    costPerMessage: safeRatio(spend, messages),
    costPerData: safeRatio(spend, data)
  };
}

export async function adsBreakdownByBrand(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.adsEntry.findMany({ where: scopedAdsWhere(filters, user) });
  const grouped = new Map<'WINHOME' | 'SIEU_THI_KE_GIA', { brand: 'WINHOME' | 'SIEU_THI_KE_GIA'; spend: number; messages: number; data: number; costPerMessage: number; costPerData: number }>();

  for (const item of items) {
    const current = grouped.get(item.brand) || { brand: item.brand, spend: 0, messages: 0, data: 0, costPerMessage: 0, costPerData: 0 };
    current.spend += toNumber(item.spend);
    current.messages += item.messages;
    current.data += item.data;
    grouped.set(item.brand, current);
  }

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    costPerMessage: safeRatio(item.spend, item.messages),
    costPerData: safeRatio(item.spend, item.data)
  }));
}

export async function phuongTotals(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.dataEntry.findMany({ where: scopedDataWhere(filters, user) });
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const winhome = items.filter((item) => item.brand === 'WINHOME').reduce((sum, item) => sum + item.count, 0);
  const sieuThiKeGia = items.filter((item) => item.brand === 'SIEU_THI_KE_GIA').reduce((sum, item) => sum + item.count, 0);
  return { total, winhome, sieuThiKeGia };
}

export async function dailyDataTrend(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.dataEntry.findMany({ where: scopedDataWhere(filters, user), orderBy: { date: 'asc' } });
  const grouped = new Map<string, { date: string; WINHOME: number; SIEU_THI_KE_GIA: number; total: number }>();

  for (const item of items) {
    const key = item.date.toISOString().slice(0, 10);
    const current = grouped.get(key) || { date: key, WINHOME: 0, SIEU_THI_KE_GIA: 0, total: 0 };
    current[item.brand] += item.count;
    current.total += item.count;
    grouped.set(key, current);
  }

  return Array.from(grouped.values());
}

export async function dailyDataRows(filters: ResolvedFilters, user: JwtUser) {
  return dailyDataTrend(filters, user);
}

export async function sourceBreakdown(filters: ResolvedFilters, user: JwtUser) {
  const items = await prisma.dataEntry.findMany({ where: scopedDataWhere(filters, user) });
  const grouped = new Map<string, { source: string; WINHOME: number; SIEU_THI_KE_GIA: number; total: number }>();

  for (const item of items) {
    const current = grouped.get(item.source) || { source: item.source, WINHOME: 0, SIEU_THI_KE_GIA: 0, total: 0 };
    current[item.brand] += item.count;
    current.total += item.count;
    grouped.set(item.source, current);
  }

  return Array.from(grouped.values()).sort((a, b) => b.total - a.total);
}

export async function brandSourceBreakdown(filters: ResolvedFilters, user: JwtUser) {
  return sourceBreakdown(filters, user);
}

export async function brandPerformanceBreakdown(filters: ResolvedFilters, user: JwtUser): Promise<BrandPerformanceRow[]> {
  const [contentEntries, seoEntries, adsEntries, dataEntries] = await Promise.all([
    prisma.contentEntry.findMany({ where: scopedContentWhere(filters, user) }),
    prisma.seoEntry.findMany({ where: scopedSeoWhere(filters, user) }),
    prisma.adsEntry.findMany({ where: scopedAdsWhere(filters, user) }),
    prisma.dataEntry.findMany({ where: scopedDataWhere(filters, user) })
  ]);

  const base: Record<'WINHOME' | 'SIEU_THI_KE_GIA', { brand: 'WINHOME' | 'SIEU_THI_KE_GIA'; content: number; seo: number; data: number; spend: number }> = {
    WINHOME: { brand: 'WINHOME', content: 0, seo: 0, data: 0, spend: 0 },
    SIEU_THI_KE_GIA: { brand: 'SIEU_THI_KE_GIA', content: 0, seo: 0, data: 0, spend: 0 }
  };

  for (const item of contentEntries) {
    base[item.brand].content += item.quantity;
  }

  for (const item of seoEntries) {
    const brand = getBrandFromWebsite(item.website);
    if (brand) base[brand].seo += item.quantity;
  }

  for (const item of adsEntries) {
    base[item.brand].spend += toNumber(item.spend);
  }

  for (const item of dataEntries) {
    base[item.brand].data += item.count;
  }

  return Object.values(base);
}

export async function recentActivities(filters: ResolvedFilters, user: JwtUser): Promise<ActivityRow[]> {
  const items = await prisma.auditLog.findMany({
    where: {
      createdAt: { gte: filters.from, lte: filters.to },
      ...(user.role === 'ADMIN' ? {} : { userId: user.id })
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  return items.map((item) => ({
    id: item.id,
    time: item.createdAt.toISOString(),
    user: item.user.fullName,
    action: item.action,
    module: item.module,
    recordId: item.recordId
  }));
}

export async function dashboardSummary(filters: ResolvedFilters, user: JwtUser): Promise<DashboardSummaryData> {
  const [contentByOwner, ads, phuong] = await Promise.all([
    contentSummaryByOwner(filters, user),
    adsTotals(filters, user),
    phuongTotals(filters, user)
  ]);

  const findOwner = (ownerName: 'NAM' | 'DUC') => contentByOwner.find((item) => item.ownerName === ownerName) || { ownerName, image: 0, video: 0, total: 0, seo: 0 };

  return {
    nam: findOwner('NAM'),
    duc: findOwner('DUC'),
    thien: ads,
    phuong
  };
}

export async function allReports(searchParams: SearchParams, user: JwtUser): Promise<AllReportsData> {
  const filters = resolveFilters(searchParams);
  const [dashboard, content, fanpage, seo, ads, adsByBrand, data, source, trend, dailyRows, brandPerformance] = await Promise.all([
    dashboardSummary(filters, user),
    contentSummaryByOwner(filters, user),
    fanpageBreakdown(filters, user),
    seoBreakdown(filters, user),
    adsTotals(filters, user),
    adsBreakdownByBrand(filters, user),
    phuongTotals(filters, user),
    sourceBreakdown(filters, user),
    dailyDataTrend(filters, user),
    dailyDataRows(filters, user),
    brandPerformanceBreakdown(filters, user)
  ]);

  return { dashboard, content, fanpage, seo, ads, adsByBrand, data, source, trend, dailyRows, brandPerformance };
}
