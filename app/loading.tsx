import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img src="/maztech-logo.png" alt="Maztech" className="h-10 w-auto object-contain" />
        </div>
        <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[#0B1F66]">Maztech MKT Hub</div>
        <div className="text-xl font-semibold text-slate-900">Đang tải dữ liệu</div>
        <div className="mt-2 text-sm text-slate-500">Vui lòng chờ trong giây lát.</div>
        <div className="mt-6 flex items-center justify-center">
          <Spinner className="h-8 w-8 border-[3px] text-[#0B1F66]" />
        </div>
      </div>
    </div>
  );
}
