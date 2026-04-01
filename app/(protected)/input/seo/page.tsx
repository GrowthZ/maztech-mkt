import { PageHeader } from '@/components/shared/page-header';
import { SeoEntryManager } from '@/components/forms/seo-entry-manager';

export default function SeoInputPage() {
  return (
    <div>
      <PageHeader title="Nhập liệu SEO" description="Nhập số bài SEO website theo ngày và nhân sự thực hiện." />
      <SeoEntryManager />
    </div>
  );
}
