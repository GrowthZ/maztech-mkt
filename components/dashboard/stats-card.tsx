import { Card } from '@/components/ui/card';

export function StatsCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <Card>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
      {subtitle ? <div className="mt-2 text-xs text-slate-500">{subtitle}</div> : null}
    </Card>
  );
}
