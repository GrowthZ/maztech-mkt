import { PageHeader } from '@/components/shared/page-header';
import { AdsEntryManager } from '@/components/forms/ads-entry-manager';

export default function AdsInputPage() {
  return (
    <div>
      <PageHeader title="Nhập liệu Ads" description="Thiên nhập chi tiêu ads, số mess và số data hằng ngày." />
      <AdsEntryManager />
    </div>
  );
}
