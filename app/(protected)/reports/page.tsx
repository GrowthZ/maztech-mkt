import { ReportsView } from '@/components/reports/reports-view';
import { PageHeader } from '@/components/shared/page-header';
import { getCurrentUser } from '@/lib/auth';
import { allReports } from '@/server/reports';
import { isAdmin } from '@/lib/permissions';
import type { SearchParams } from '@/types';

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user) return null;
  const data = await allReports(searchParams, user);

  return (
    <div>
      <PageHeader title="Báo cáo tổng hợp" description="Báo cáo content, SEO, Ads, data đầu vào và breakdown theo nguồn." />
      <ReportsView data={data} canExport={isAdmin(user)} />
    </div>
  );
}
