import { PageHeader } from '@/components/shared/page-header';
import { DataEntryManager } from '@/components/forms/data-entry-manager';

export default function DataInputPage() {
  return (
    <div>
      <PageHeader title="Nhập data đầu vào" description="Phượng nhập data theo ngày, thương hiệu và nguồn data." />
      <DataEntryManager />
    </div>
  );
}
