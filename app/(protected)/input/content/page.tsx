import { PageHeader } from '@/components/shared/page-header';
import { ContentEntryManager } from '@/components/forms/content-entry-manager';

export default function ContentInputPage() {
  return (
    <div>
      <PageHeader title="Nhập liệu social" description="Nam và Đức nhập số bài ảnh, video theo ngày, fanpage và thương hiệu." />
      <ContentEntryManager />
    </div>
  );
}
