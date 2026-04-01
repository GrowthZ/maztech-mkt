import { PageHeader } from '@/components/shared/page-header';
import { getCurrentUser } from '@/lib/auth';
import { resolveFilters } from '@/lib/filters';
import { brandPerformanceBreakdown, dashboardSummary, dailyDataTrend, fanpageBreakdown, recentActivities, sourceBreakdown } from '@/server/reports';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import type { SearchParams } from '@/types';

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user) return null;
  const filters = resolveFilters(searchParams);

  const [summary, trend, fanpage, source, brandPerformance, activity] = await Promise.all([
    dashboardSummary(filters, user),
    dailyDataTrend(filters, user),
    fanpageBreakdown(filters, user),
    sourceBreakdown(filters, user),
    brandPerformanceBreakdown(filters, user),
    recentActivities(filters, user)
  ]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Tổng quan nhanh hiệu suất nhập liệu và báo cáo Marketing theo bộ lọc hiện tại." />
      <DashboardOverview summary={summary} trend={trend} fanpage={fanpage} source={source} brandPerformance={brandPerformance} activity={activity} />
    </div>
  );
}
