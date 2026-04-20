export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="text-slate-300 font-medium">{title}</div>
    {hint && <div className="text-sm text-slate-500 mt-1">{hint}</div>}
  </div>
);

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-slate-800/60 ${className}`} />
);
