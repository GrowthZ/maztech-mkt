export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4 sm:mb-5">
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}
