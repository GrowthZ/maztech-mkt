import { Card } from '@/components/ui/card';

export function EmptyState({ message = 'Chưa có dữ liệu' }: { message?: string }) {
  return (
    <Card className="py-10 text-center text-sm text-slate-500">
      {message}
    </Card>
  );
}
