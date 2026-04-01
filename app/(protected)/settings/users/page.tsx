import { PageHeader } from '@/components/shared/page-header';
import { UsersManager } from '@/components/forms/users-manager';

export default function UsersSettingsPage() {
  return (
    <div>
      <PageHeader title="Quản lý người dùng" description="Admin tạo, cập nhật tài khoản và phân quyền hệ thống." />
      <UsersManager />
    </div>
  );
}
