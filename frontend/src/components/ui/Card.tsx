import { PropsWithChildren } from 'react';

export const Card = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <div className={`rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-4 shadow ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, sub }: PropsWithChildren<{ sub?: string }>) => (
  <div className="mb-3">
    <div className="text-xs uppercase tracking-wider text-slate-400">{children}</div>
    {sub && <div className="text-sm text-slate-500 mt-0.5">{sub}</div>}
  </div>
);
