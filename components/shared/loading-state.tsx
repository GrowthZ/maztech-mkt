export function LoadingState({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  return <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500 shadow-soft">{message}</div>;
}
