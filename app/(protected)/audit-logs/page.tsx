import { PageHeader } from '@/components/shared/page-header';
import { AuditLogsTable } from '@/components/tables/audit-logs-table';

export default function AuditLogsPage() {
  return (
    <div>
      <PageHeader title="Audit log" description="Theo dõi toàn bộ thao tác create, update, delete trên hệ thống." />
      <AuditLogsTable />
    </div>
  );
}
