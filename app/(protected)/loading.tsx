import { Spinner } from '@/components/ui/spinner';

export default function ProtectedLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-soft">
        <Spinner className="h-5 w-5 text-[#0B1F66]" />
        Đang chuyển trang...
      </div>
    </div>
  );
}
